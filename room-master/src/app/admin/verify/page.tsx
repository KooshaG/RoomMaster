import { prisma } from '@/prismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import VerifyUserButton from '@/components/button/VerifyUserButton';

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id && session.user.admin) {
    const unverifiedUsers = await prisma.user.findMany({ where: { verified: false }, orderBy: { createdAt: 'asc' } });

    return (
      <div className="overflow-x-auto py-4">
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Concordia E-Mail</th>
              <th>Created At</th>
              <th>Verify</th>
            </tr>
          </thead>
          <tbody>
            {unverifiedUsers.map((user) => {
              return (
                <tr key={user.id} className='hover'>
                  <td>{user.name ?? 'null'}</td>
                  <td>{user.email ?? 'null'}</td>
                  <td>{user.loginUsername ?? 'null'}</td>
                  <td>
                    {user.createdAt.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: '2-digit' })}
                  </td>
                  <td>
                    <VerifyUserButton userId={user.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return <p>o no</p>;
}
