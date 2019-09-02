import React, { Component } from 'react';
import Axios from 'axios'
import swal from 'sweetalert'
import {urlApi} from '../../3.helpers/database'
import './style.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


class AdminDashboard extends Component {
    state = {
        productData : [],
        inputName : '',
        inputPrice : '',
        inputDiscount : '',
        inputCategory : '',
        inputDesc : '',
        inputImg : '',
        contentPerPage : 3,
        page : 0,
        editMode : false,
        editItem : null
    }

    componentDidMount(){
        this.getDataProducts()
    }

    getDataProducts = () => {
        Axios.get(urlApi + 'products')
        .then((res) => {
            this.setState({productData : res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderProducts = () => {
        let showData = this.state.productData.slice(this.state.page * this.state.contentPerPage, this.state.page * this.state.contentPerPage + this.state.contentPerPage)
        let jsx = showData.map((val, idx) => {
            return (
                <tr>
                    <td>{val.nama}</td>
                    <td>{val.harga}</td>
                    <td>{val.discount}</td>
                    <td>{val.category}</td>
                    <td>{val.deskripsi}</td>
                    <td><img src={val.img} alt="gambar" width="80px"/></td>
                    <td><input type="button" className="btn btn-success btn-block" value="EDIT" onClick={() => this.setState({editMode : true, editItem : val})}/></td>
                </tr>
            )
        })
        return jsx
    }

    onBtnAddProduct = () => {
        let {inputCategory, inputDesc, inputDiscount, inputImg, inputName, inputPrice} = this.state
        if(inputCategory && inputDesc && inputDiscount && inputImg && inputName && inputPrice){
            let newData = {
                nama : this.state.inputName,
                harga : this.state.inputPrice,
                category : this.state.inputCategory,
                discount : this.state.inputDiscount,
                deskripsi : this.state.inputDesc,
                img : this.state.inputImg
            }
    
            Axios.post(urlApi + 'products', newData)
            .then(res => {
                swal('Success!!', "Product has been ditambah", 'success')
                this.getDataProducts()
            })
            .catch((err) => {
                swal('Error', 'No good server', 'error')
            })
        }else{
            swal('Error', 'Harus kudu wajib diinput', 'error')
        }
    }

    onBtnSaveEdit = () => {
        let newItem = {
            id : this.state.editItem.id,
            nama : this.refs.editName.value ? this.refs.editName.value : this.state.editItem.nama,
            harga : this.refs.editPrice.value ? this.refs.editPrice.value : this.state.editItem.harga,
            category : this.refs.editCategory.value ? this.refs.editCategory.value : this.state.editItem.category,
            discount : this.refs.editDiscount.value ? this.refs.editDiscount.value : this.state.editItem.discount,
            deskripsi : this.refs.editDesc.value ? this.refs.editDesc.value : this.state.editItem.deskripsi,
            img : this.refs.editImg.value ? this.refs.editImg.value : this.state.editItem.img
        }

        Axios.put(urlApi + 'products/' + this.state.editItem.id, newItem)
        .then(res => {
            this.getDataProducts()
            swal('Edit Success', 'Your item sudah diedit', 'success')
        })
        .catch(err => {
            console.log(err)
            swal('Error', 'Ada masalah bro', 'error')
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-header border-0">
                                <h3>Admin Dashboard</h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-dark text-white rounded">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Image Url</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderProducts()}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer align-items-center">
                                <div className="row">
                                    <div className="col-6"></div>
                                    <div className="col-6"><input onClick={() => this.setState({page : this.state.page + 1})} value="Next Page >>" type="button" className="btn btn-block btn-secondary"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header">
                                <h3>Add Product</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-4">
                                        <input type="text" onChange={(e) => this.setState({inputName : e.target.value})} className="form-control" placeholder="Product Name"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="number" onChange={(e) => this.setState({inputPrice : e.target.value})} className="form-control" placeholder="Price"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="number" onChange={(e) => this.setState({inputDiscount : e.target.value})} className="form-control" placeholder="Discount"/>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <input type="text" onChange={(e) => this.setState({inputCategory : e.target.value})} className="form-control" placeholder="Category"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" onChange={(e) => this.setState({inputDesc : e.target.value})} className="form-control" placeholder="Description"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" onChange={(e) => this.setState({inputImg : e.target.value})} className="form-control" placeholder="Image URL"/>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <input onClick={this.onBtnAddProduct} type="button" className="btn btn-success btn-block" value="ADD"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.editMode}>
                    <ModalHeader>

                    </ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </Modal>
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header">
                                <h3>Add Product</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-4">
                                        <input type="text" ref="editName" className="form-control" placeholder="Product Name"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="number" ref="editPrice" className="form-control" placeholder="Price"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="number" ref="editDiscount" className="form-control" placeholder="Discount"/>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <input type="text" ref="editCategory" className="form-control" placeholder="Category"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" ref="editDesc" className="form-control" placeholder="Description"/>
                                    </div>
                                    <div className="col-4">
                                        <input type="text" ref="editImg" className="form-control" placeholder="Image URL"/>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <input type="button" className="btn btn-success btn-block" value="SAVE"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminDashboard;