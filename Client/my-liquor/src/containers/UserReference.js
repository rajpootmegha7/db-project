import React, { Component } from 'react'
import './userreference.css'


import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';


export default class UserReference extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             user: localStorage.getItem('username'),
             searchs: 0,
             saveddata: null,
             selectedrow: null,
             first: 0,
             rows: 10,

        }
        this.columns = [
            {field: 'sql', header: 'Query'},
            {field: 'date', header: 'Date_Time'},
        ];
        this.getReferenceDetails = this.getReferenceDetails.bind(this);
    }

    getReferenceDetails= () =>{
        // e.preventDefault();

        var url ="http://localhost:4000/login/api/get_saved_details";
        var request = new Request(url, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({user: this.state.user})
          });
      
          console.log('getReferenceDetails');
          var that = this;
          fetch(request)
            .then((response)=>{
                if (response.status === 400) throw new Error();
                response.json().then(function (data) {
                    console.log(data);
                    that.setState({saveddata: that.displaySavedData(data.tbl.rows), searchs: data.tbl.rowCount})
                })
            })
            .catch((err)=>{
                this.toast.show({severity:'error', summary: 'Error Message', detail:'No Data Found', life: 3000});
            })

    }

    componentDidMount(){
        this.getReferenceDetails();
    }

    displaySavedData=(data)=>{
        if(data === undefined || data.length === 0) return;
        
        let table_data = [];

        data.forEach((row)=>{
            var sql_query_formed = "select " + row.search_history + "from" + row.log_info + "where" + row.other;
            var date_time = row.search_date;
            let temp_data = {
                sql: sql_query_formed.replaceAll('"',"'"),
                date: date_time
            }
            table_data.push(temp_data)
        })
        console.log(table_data)
        return table_data;

    }
    //Table pagination functions
    onCustomPage2 = (event) => {
        this.setState({
            first: event.first,
            rows: event.rows
        });
    }

    getDataforSelectedrow(event){

        console.log('getDataforSelectedrow');
        event.preventDefault();
        if(this.state.selectedrow.sql === null || this.state.selectedrow.sql === undefined) return;

        var req_data = {query: this.state.selectedrow.sql}

        var req = new Request('http://localhost:4000/pgresms/validate/reference_query_result', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(req_data)
        });

        fetch(req)
            .then((res)=>{
                if(res.status === 400) throw new Error(res.statusText);
                res.json().then((data)=>{

                    this.setState({restuarantdata: data.tbl})
                    this.toast.show({severity:'success', summary: 'Sucessfully Retrieved Data from Server', life: 3000});
                })
            })
            .catch((err)=>{
                console.log(err)
                this.toast.show({severity:'error', summary: 'Error Message', detail:err.message, life: 3000});
            })
    }
    getQueryResultSubmit = (req_data) =>{
        
    }


    render() {
        const dynamicColumns = this.columns.map((col,i) => {
            return <Column field={col.field} header={col.header} />;
        });
        //Table Pagination Handle
        const template2 = {
            layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
            'RowsPerPageDropdown': (options) => {
                const dropdownOptions = [
                    { label: 10, value: 10 },
                    { label: 20, value: 20 },
                    { label: 50, value: 50 }
                ];

                return (
                    <React.Fragment>
                        <span className="p-mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Items per page: </span>
                        <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} appendTo={document.body} />
                    </React.Fragment>
                );
            },
            'CurrentPageReport': (options) => {
                return (
                    <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                        {options.first} - {options.last} of {options.totalRecords}
                    </span>
                )
            }
        };
        
        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                {/* Reference {this.state.saveddata !== null ? this.displaySavedData(this.state.saveddata) : null} */}
                <h4 style={{'font-family': 'Raleway'}}>You have Searched for <h1 style={{'color': 'hotpink','font-size': '45px', 'margin-left': '10px'}}>{this.state.searchs}</h1> times and Saved References</h4>
                <div className="card">
                    <DataTable value={this.state.saveddata} selection={this.state.selectedrow} onSelectionChange={e => this.setState({ selectedrow: e.value })} 
                    responsiveLayout="scroll">
                        <Column selectionMode="single" headerStyle={{width: '3em'}}></Column>
                        {dynamicColumns}
                    </DataTable>

                    <div className='btn-load-result-div'>
                        <Button className='btn-load-result' label="Load Result" onClick={(e) => this.getDataforSelectedrow(e)} />
                    </div>
                    

                    <div className='result-contianer'>
                        <DataTable value={this.state.restuarantdata} paginator paginatorTemplate={template2} 
                        first={this.state.first} rows={this.state.rows} onPage={this.onCustomPage2} responsiveLayout="scroll"
                        paginatorClassName="p-jc-end" className="p-mt-6" >
                            <Column field="premise_name" header="Resturant" sortable></Column>
                            <Column field="premise_addr" header="Address" sortable></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        )
    }
}
