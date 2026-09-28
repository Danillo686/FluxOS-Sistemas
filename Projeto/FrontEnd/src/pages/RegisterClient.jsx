// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// export default function RegisterClient() {
//     const [cep, setCep] = useState('')
//     const [cpf, setCpf] = useState('')
//     const [nome, setNome] = useState('')
//     const [email, setEmail] = useState('')
//     const [senha, setSenha] = useState('')
//     const navigate = useNavigate()
//     const ehEmailValido = email.endsWith('@gmail.com')

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         if (!ehEmailValido) {
//             alert('Por favor, insira um email válido do Gmail.')
//             return
//         }
//         console.log('Cadastro', { cep, cpf, nome, email, senha })
//         alert('Cadastro realizado com sucesso!')
//     }

//     return (
//         <div>
//             <h2>Login Admin</h2>
//             <form onSubmit={handleSubmit}>

//                 <div>
//                     <label htmlFor="cep">CEP:</label>
//                     <input
//                         type="text"
//                         placeholder="Seu CEP"
//                         id="cep"
//                         value={cep}
//                         onChange={(e) => setCep(e.target.value)}
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="cpf">CPF:</label>
//                     <input
//                         type="text"
//                         placeholder="Seu CPF"
//                         id="cpf"
//                         value={cpf}
//                         onChange={(e) => setCpf(e.target.value)}
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="nome">Nome:</label>
//                     <input
//                         type="text"
//                         placeholder="Seu nome"
//                         id="nome"
//                         value={nome}
//                         onChange={(e) => setNome(e.target.value)}
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="cpf">CPF:</label>
//                     <input
//                         type="text"
//                         placeholder="Seu CPF"
//                         id="cpf"
//                         value={cpf}
//                         onChange={(e) => setCpf(e.target.value)}
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="email">Email:</label>
//                     <input
//                         type="email"
//                         placeholder="Seu email"
//                         id="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="senha">Senha:</label>
//                     <input
//                         type="password"
//                         placeholder="Sua senha"
//                         id="senha"
//                         value={senha}
//                         onChange={(e) => setSenha(e.target.value)}
//                     />
//                 </div>
    
//                 <button type="submit">Entrar</button>
//                 <button type="button" onClick={() => navigate('/')}>Voltar</button>
                
//             </form>
//         </div>


//     )
// }