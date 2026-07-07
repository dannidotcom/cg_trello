import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import "react-toastify/dist/ReactToastify.min.css";
import { RouteComponentProps } from "react-router";
import './Style.css'
import bgHeader from '../asserts/images/ccgroup.png'
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

type SomeComponentProps = RouteComponentProps;

const Login: FC<SomeComponentProps> = ({ history }): JSX.Element => {

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
    const login = (data: any) => {
        let params = {
            username: data.username,
            password: data.password,
        };
        axios
            .post("https://127.0.0.1:8000/api/login_check", params)
            .then(function (response) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("refresh_token", response.data.refresh_token);
                console.log('message : ' + response.data.token);
                    Toast.fire({
                        icon: 'success',
                        title: 'Login successfully'
                    })
                    setTimeout(() => {
                        history.push("/home");
                    }, 1000);
            })
            .catch(function (error) {
                console.log(error); 
                Swal.fire("Oops !", "Nom d'utilisateur ou mot de passe incorrecte", "error");
            });
    };
    return (
        <div className="login">
        <div className="security-page">
            <div className="container my-5">
                <div className="row mt-5">
                    <div className="col-lg-4 mx-auto mt-5" id="form-login">
                        <div className="logo">
                            <img src={bgHeader} alt="CG-LOGO"/>
                        </div>
                            <form method="post" id="pro-login" className="form-responsive" autoComplete="off" onSubmit={handleSubmit(login)}>
                            <div className="col-md-12">
                                <h3 className="title text-center">Authentification</h3>
                            </div>
                            <label htmlFor=" username">E-mail</label>
                                <input type="text" placeholder="Adresse email" {...register("username", { required: "Email address is required!" })} id="inputEmail" className="form-control"/>
                                {errors.username && (
                                    <p className="text-danger" style={{ fontSize: 14 }} >
                                        {errors.username && <span>L'adresse email est nécessaire</span>}
                                    </p>
                                )}
                                <div>
                                <label htmlFor="password">Mot de passe</label>
                                    <input type="password" id="password" placeholder="Mot de passe"  {...register("password", {
                                        required: "Password is required!",
                                    })} className="form-control" />
                                    {errors.password && (
                                        <p className="text-danger" style={{ fontSize: 14 }}>
                                            {errors.password && <span>Mot de passe requis!</span>}
                                        </p>
                                     )}
                            </div>
                            <div className="checkbox mb-3 row mb-20px">
                                <label>
                                    <input type="checkbox" name="_remember_me" /> Se souvenir de moi
                                    <Link to="/forgot_password"  className="btn btn-link" id="forgot_password">Mot de passe oublié ?</Link>
                                </label>
                            </div>
                            <button type="submit" className="btn mt-2 w-100 btn-connexion ">Se connecter </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
</div>);
};
export default Login;