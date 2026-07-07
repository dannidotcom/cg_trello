import React, { FC } from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form';

import { RouteComponentProps } from "react-router";
import { Flip, ToastContainer } from 'react-toastify';
import bgHeader from '../asserts/images/ccgroup.png'
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

type SomeComponentProps = RouteComponentProps;
const Nouveau: FC<SomeComponentProps> = ({ history }): JSX.Element => {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const token  = useParams();
    

    
    const reset = (data: any) => {
        let params = {
            password: data.password
        };
       let ken= Object(token)["token"];
        axios
            .post(`https://127.0.0.1:8000/new_password/${ken}`, params)
            .then(function (response) {
                Toast.fire({
                    icon: 'success',
                    title: 'Mots de passe bien reinitialiser'
                })

                setTimeout(() => {
                    history.push("/");
                }, 3000);

            })
            .catch(function (error) {
                console.log(error);
               
            });
    };
    return (
        <div className="nouveau">
            <div className="security-page">
                <div className="container my-5">
                    <div className="row mt-5">
                        <div className="col-lg-4 mx-auto mt-5" id="form-login">
                            <div className="logo">
                                <img className="img-responsive" src={bgHeader} alt="" /><br />
                            </div>
                            <form autoComplete="off" onSubmit={handleSubmit(reset)} id="pro-login" className="form-responsive" >
                                <div className="col-md-12">
                                    <h3 className="title text-center">Nouveau mot de passe</h3>
                                </div>
                                <div>
                                    <label htmlFor="password">Nouveau mot de passe</label>
                                    <input type="password" {...register("password", { required: true })} id="inputPassword" placeholder="Nouveau mot de passe" className="form-control" /><br />
                                    {errors.password && (
                                        <span className="error-message  text-danger" >{errors.password && <span>Mot de passe requis!</span>}
                                       </span>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="password">Confirme mot de passe</label>
                                    <input type="password" id="inputConfirm" placeholder="Confirme mot de passe" {...register("cpassword", {
                                        required: true,
                                        validate: (value) =>
                                            value === watch("password") || "Passwords don't match.",})} className="form-control" /><br />
                                    {errors.cpassword && (
                                        <span className="error-message  text-danger" >{errors.cpassword && <span>Les mots de passe ne correspondent pas</span>}
                                        </span>
                                    )}
                                </div>
                                <div className="checkbox mb-3 row mb-20px">
                                </div>
                                <button type="submit" className="btn mt-2 w-100 btn-connexion ">Valider </button>
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
export default Nouveau