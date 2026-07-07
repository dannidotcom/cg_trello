import React, { FC } from "react";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from "react-router";
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
    });

    const forgotpassword = (data: any) => {
        Toast.fire({
            icon: 'success',
            title: 'E-mail envoyé avec succès'
        });
        setTimeout(() => {
            history.push("/message");
        }, 2000);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card" style={{ maxWidth: '440px' }}>
                    <div className="login-header">
                        <div className="login-logo">
                            <img className="img-responsive" src={bgHeader} alt="" />
                        </div>
                        <h2>Réinitialisation</h2>
                        <p className="login-subtitle">Entrez votre adresse e-mail pour recevoir un lien de réinitialisation</p>
                    </div>
                    <form autoComplete="off" onSubmit={handleSubmit(forgotpassword)} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Adresse email</label>
                            <input
                                type="email"
                                placeholder="exemple@cg-group.com"
                                {...register("username", { required: "Email requis" })}
                                id="inputEmail"
                                className="form-input"
                            />
                            {errors.email && (
                                <span className="form-error">Email requis</span>
                            )}
                        </div>
                        <div className="form-options">
                            <Link to="/" className="forgot-link">← Retour à la connexion</Link>
                        </div>
                        <button type="submit" className="btn-login">Envoyer</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default ForgotPassword;
