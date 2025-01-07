import { auth } from '@cfce/auth';
import { getUserByEmail } from '@cfce/database';
import LoginButton from '../../components/LoginButton';
import { generateApiKey } from './actions';

const APIKeyManager = async () => null;

// const APIKeyManager = async () => {
//   const session = await auth();

//   const userData = await getUserByEmail(session?.user?.email ?? '');
//   const apiKey = userData?.api_key;

//   return (
//     <div>
//       <h2>API Key Manager</h2>
//       <LoginButton />
//       {apiKey ? (
//         <div>
//           <p>Your API Key: {apiKey}</p>
//           <form action={generateApiKey}>
//             <button type="submit">Regenerate API Key</button>
//           </form>
//         </div>
//       ) : (
//         <form action={generateApiKey}>
//           <button type="submit">Generate API Key</button>
//         </form>
//       )}
//       {userData && (
//         <div>
//           <h3>User Data:</h3>
//           <pre>{JSON.stringify(userData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

export default APIKeyManager;
