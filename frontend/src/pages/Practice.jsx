import { PROBLEMS } from '../utils/mockApi';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle } from 'lucide-react';

const Practice = () => {
  const navigate = useNavigate();

  // In practice mode, we create a 'solo' room
  const startPractice = (problemId) => 
{
    const soloRoomId = `practice_${problemId}_${Math.random().toString(36).substr(2, 5)}`;
    navigate(`/arena/${soloRoomId}`);
};

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Practice Arena</h1>
        <p className="text-gray-400">Sharpen your skills before entering the battlefield.</p>
      </div>

      <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-[#252526] text-gray-400 text-xs uppercase border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 w-12">Status</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Acceptance</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {PROBLEMS.map((prob, idx) => (
              <tr key={prob.id} className="hover:bg-white/5 transition group">
                <td className="px-6 py-4">
                  {idx % 2 === 0 ? <CheckCircle size={18} className="text-green-500"/> : <Circle size={18} className="text-gray-600"/>}
                </td>
                <td className="px-6 py-4 font-medium text-white">{prob.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    prob.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                    prob.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {prob.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">{prob.acceptance}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => startPractice(prob.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition opacity-0 group-hover:opacity-100"
                  >
                    Solve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Practice;