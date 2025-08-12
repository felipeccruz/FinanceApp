import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from './ui';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const { signIn, signUp, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();

    if (!isLogin && password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        alert('Verifique seu email para confirmar o cadastro!');
      }
    } catch (error) {
      console.error('Erro de autenticação:', error);
    }
  };

  const toggleMode = (): void => {
    setIsLogin(!isLogin);
    clearError();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const features = [
    { icon: 'fas fa-chart-pie', label: 'Relatórios Visuais' },
    { icon: 'fas fa-bullseye', label: 'Metas Financeiras' },
    { icon: 'fas fa-shield-alt', label: 'Dados Seguros' }
  ];

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
                  <Input
                    type="email"
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="seu@email.com"
                    required
                    className="mb-3"
                  />

                  <Input
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={setPassword}
                    placeholder="Sua senha"
                    required
                    className="mb-3"
                    min="6"
                  />

                  {!isLogin && (
                    <Input
                      type="password"
                      label="Confirmar Senha"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Confirme sua senha"
                      required
                      className="mb-3"
                      min="6"
                    />
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    loading={loading}
                    icon={isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus'}
                    className="w-100 mb-3"
                  >
                    {loading 
                      ? (isLogin ? 'Entrando...' : 'Cadastrando...') 
                      : (isLogin ? 'Entrar' : 'Cadastrar')
                    }
                  </Button>
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

            {/* Features Section */}
            <div className="text-center mt-4 text-white">
              <h5>🎯 Características do App</h5>
              <div className="row">
                {features.map((feature, index) => (
                  <div key={index} className="col-4">
                    <i className={`${feature.icon} fa-2x mb-2`}></i>
                    <p><small>{feature.label}</small></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 