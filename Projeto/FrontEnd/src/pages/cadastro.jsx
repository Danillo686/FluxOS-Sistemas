// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';


// export default function Cadastro() {
//     const [nome, setNome] = useState('');
//     const [email, setEmail] = useState('');
//     const [senha, setSenha] = useState('');
//     const [confirmarSenha, setConfirmarSenha] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (senha !== confirmarSenha) {
//             alert('As senhas não coincidem!');
//             return;
//         }
        
//         console.log('Cadastros', { nome, email, senha });
//         alert('Cadastro realizado com sucesso!');
//         navigate('/login');
//     };
    
    

//     return (
//         <div className="container">
//             <h2>Cadastrar</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Nome:</label>
//                     <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)}/>
//                 </div>

//                 <div>
//                     <label>Email:</label>
//                     <input type="email" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)}/>
//                 </div>

//                 <div>
//                     <label>Senha:</label>
//                     <input type="password" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
//                 </div>

//                 <div>
//                     <label>Confirmar Senha:</label>
//                     <input type="password" placeholder="Confirme sua senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}/>
//                 </div>

//                 <button type="button" onClick={() => navigate('/')}>Cadastrar</button>

//                 <button type="button" onClick={() => navigate('/')}>
//                     Já tenho conta (Entrar)
//                 </button>
                

//             </form>
//         </div>
//     )
// }