import React, { FC } from "react";
import { useForm } from 'react-hook-form';
import { RouteComponentProps } from "react-router";
import bgHeader from '../asserts/images/ccgroup.png'
import Swal from "sweetalert2";

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
    });

    const reset = (data: any) => {
        Toast.fire({
            icon: 'success',
            title: 'Mot de passe réinitialisé'
        });
        setTimeout(() => {
            history.push("/");
        }, 3000);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card" style={{ maxWidth: '420px' }}>
                    <div className="login-header">
                        <div className="login-logo">
                            <img className="img-responsive" src={bgHeader} alt="" />
                        </div>
                        <h2>Nouveau mot de passe</h2>
                        <p className="login-subtitle">Choisissez un nouveau mot de passe sécurisé</p>
                    </div>
                    <form autoComplete="off" onSubmit={handleSubmit(reset)} className="login-form">
                        <div className="form-group">
                            <label htmlFor="password">Nouveau mot de passe</label>
                            <input
                                type="password"
                                {...register("password", { required: true })}
                                id="inputPassword"
                                placeholder="••••••••"
                                className="form-input"
                            />
                            {errors.password && (
                                <span className="form-error">Mot de passe requis</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="cpassword">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                id="inputConfirm"
                                placeholder="••••••••"
                                {...register("cpassword", {
                                    required: true,
                                    validate: (value) =>
                                        value === watch("password") || "Les mots de passe ne correspondent pas",
                                })}
                                className="form-input"
                            />
                            {errors.cpassword && (
                                <span className="form-error">Les mots de passe ne correspondent pas</span>
                            )}
                        </div>
                        <button type="submit" className="btn-login">Valider</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Nouveau;
