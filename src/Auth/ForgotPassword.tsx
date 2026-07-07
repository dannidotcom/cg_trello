import React, { FC } from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { RouteComponentProps } from "react-router";
import { Flip, ToastContainer } from 'react-toastify';
import bgHeader from '../asserts/images/ccgroup.png'
import Swal from "sweetalert2";

type SomeComponentProps = RouteComponentProps;
const ForgotPassword: FC<SomeComponentProps> = ({ history }): JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const forgotpassword = (data: any) => {
        let params = {
            username: data.username,
        };
        console.log('REsponse : ' +params);
        axios
            .post("https://127.0.0.1:8000/forgot_password", params)
            .then(function (response) {   
                console.log('REsponse: ' + JSON.stringify(response.data));  
               // console.log('Token : ' + response.data.access_token);   
                
                    Toast.fire({
                        icon: 'success',
                        title: 'E-mail envoyé avec succès'
                    })

                localStorage.setItem("token", response.data.access_token);
                    setTimeout(() => {
                        history.push("/message");
                    }, 2000);
                
            })

            .catch(function (error) {
                if (error.response.data.code === 404){
                    Swal.fire('Oops !!', error.response.data.message, 'warning')
                }
                
            });
    };
    return (
        <div className="forgotPassword">
            <div className="security-page">
                <div className="container my-5">
                    <div className="row mt-5">
                        <div className="col-lg-4 mx-auto mt-5" id="form_forgot_password">
                            <div className="logo">
                                <img className="img-responsive" src={bgHeader} alt="" />
                            </div>
                            <form autoComplete="off" onSubmit={handleSubmit(forgotpassword)} id="pro-login" className="form-responsive">
                                <div className="col-md-12">
                                    <h3 className="title text-center">Réinitialisation du mot de passe</h3>
                                    <p className="text-center">Entrez votre <b>adresse e-mail</b>. Nous vous enverrons par e-mail un lien pour réinitialiser votre mot de passe.</p>
                                </div>
                                <label htmlFor=" email">Adresse email</label>
                                <input type="email" placeholder="users.camson@group.fr" {...register("username", { required: "email is required!" })} id="inputEmail" className="form-control" required />
                                {errors.email && (
                                    <p className="text-danger" style={{ fontSize: 14 }} >
                                        {/*errors.email.message*/}
                                    </p>
                                )}
                                <div className="checkbox mb-3 row mb-20px">
                                    <label>
                                        <Link to="/"  className="btn btn-link" id="connecter">Se connecter</Link>
                                    </label>
                                </div>
                                <button type="submit" className="btn mt-2 w-100 btn-connexion ">Envoyer </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
                limit={1}
                transition={Flip}
            />
        </div>
    );
}
export default ForgotPassword