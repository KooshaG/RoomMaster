import { prisma } from '@/prismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id && session.user.admin) {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

    return (
      <div className="overflow-x-auto py-4">
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Concordia E-Mail</th>
              <th>Verified</th>
              <th>Created At</th>
              <th>View User</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id} className='hover'>
                  <td>{user.name ?? 'null'}</td>
                  <td>{user.email ?? 'null'}</td>
                  <td>{user.loginUsername ?? 'null'}</td>
                  <td>{user.verified ? '✅' : '❌'}</td>
                  <td>
                    {user.createdAt.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: '2-digit' })}
                  </td>
                  <td>
                  <Link href={`/admin/users/details?user=${user.id}`} className={`btn btn-sm btn-primary`}>
                    View User
                  </Link>
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
