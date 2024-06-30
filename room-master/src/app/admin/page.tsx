import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import LinkButton from '@/components/button/LinkButton';
import ScheduleView from '@/components/Schedule/ScheduleView';

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (session && session.user.id && session.user.admin) {

    return (
      <div className="flex flex-col gap-4 items-center w-80 m-auto">
        <LinkButton href='/admin/verify'>Verify Users</LinkButton>
        <LinkButton href='/admin/users'>View Users</LinkButton>
        {/* <LinkButton href='/admin/log'>Audit Log</LinkButton> */}
      </div>
    );
  }
  return redirect('/');
}
