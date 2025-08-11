import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { signIn, signUp, loading, error, clearError } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()

        if (!isLogin && password !== confirmPassword) {
            alert('As senhas não coincidem')
            return
        }

        try {
            if (isLogin) {
                await signIn(email, password)
            } else {
                await signUp(email, password)
                alert('Verifique seu email para confirmar o cadastro!')
            }
        } catch (error) {
            console.error('Erro de autenticação:', error)
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        clearError()
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-lg">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <i className="fas fa-chart-line fa-3x mb-3" style={{ color: '#667eea' }}></i>
                                    <h2 className="fw-bold">FinanceApp</h2>
                                    <p className="text-muted">
                                        {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Sua senha"
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    {!isLogin && (
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Confirmar Senha</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirme sua senha"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                {isLogin ? 'Entrando...' : 'Cadastrando...'}
                                            </>
                                        ) : (
                                            <>
                                                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'} me-2`}></i>
                                                {isLogin ? 'Entrar' : 'Cadastrar'}
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-link text-decoration-none"
                                        onClick={toggleMode}
                                    >
                                        {isLogin ? (
                                            'Não tem uma conta? Cadastre-se'
                                        ) : (
                                            'Já tem uma conta? Entre'
                                        )}
                                    </button>
                                </div>

                                {!isLogin && (
                                    <div className="mt-3">
                                        <small className="text-muted">
                                            <i className="fas fa-info-circle me-1"></i>
                                            Ao se cadastrar, você receberá um email de confirmação.
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center mt-4 text-white">
                            <h5>🎯 Características do App</h5>
                            <div className="row">
                                <div className="col-4">
                                    <i className="fas fa-chart-pie fa-2x mb-2"></i>
                                    <p><small>Relatórios Visuais</small></p>
                                </div>
                                <div className="col-4">
                                    <i className="fas fa-bullseye fa-2x mb-2"></i>
                                    <p><small>Metas Financeiras</small></p>
                                </div>
                                <div className="col-4">
                                    <i className="fas fa-shield-alt fa-2x mb-2"></i>
                                    <p><small>Dados Seguros</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth 