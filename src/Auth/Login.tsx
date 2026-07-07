import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router";
import './Style.css'
import bgHeader from '../asserts/images/ccgroup.png'
import Swal from "sweetalert2";

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
    });

    const login = (data: any) => {
        // Mock login - accept any credentials
        const mockToken = "mock_jwt_token_" + Date.now();
        const mockUser = {
            id: 1,
            username: data.username,
            roles: ["ROLE_USER", "ROLE_ADMIN"],
            email: data.username
        };

        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", mockToken);
        localStorage.setItem("refresh_token", mockToken + "_refresh");

        Toast.fire({
            icon: 'success',
            title: 'Connexion réussie !'
        });

        setTimeout(() => {
            history.push("/home");
        }, 800);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">
                            <img src={bgHeader} alt="CG-LOGO" />
                        </div>
                        <h2>Bienvenue</h2>
                        <p className="login-subtitle">Connectez-vous à votre espace de travail</p>
                    </div>
                    <form method="post" className="login-form" autoComplete="off" onSubmit={handleSubmit(login)}>
                        <div className="form-group">
                            <label htmlFor="username">Adresse email</label>
                            <input
                                type="text"
                                placeholder="exemple@cg-group.com"
                                {...register("username", { required: "Email requis" })}
                                id="inputEmail"
                                className="form-input"
                            />
                            {errors.username && (
                                <span className="form-error">Email requis</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                {...register("password", { required: "Mot de passe requis" })}
                                className="form-input"
                            />
                            {errors.password && (
                                <span className="form-error">Mot de passe requis</span>
                            )}
                        </div>
                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" name="_remember_me" />
                                <span>Se souvenir de moi</span>
                            </label>
                            <Link to="/forgot_password" className="forgot-link">Mot de passe oublié ?</Link>
                        </div>
                        <button type="submit" className="btn-login">
                            Se connecter
                        </button>
                    </form>
                    <div className="login-footer">
                        <p>Mode démo — utilisez n'importe quel identifiant</p>
                    </div>
                </div>
                <div className="login-bg-decoration" />
            </div>
        </div>
    );
};
export default Login;
