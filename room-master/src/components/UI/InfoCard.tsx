import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-md m-2">
      <div className="card-body">
        <h2 className="card-title font-bold text-2xl">{title}</h2>
        {children}
      </div>
    </div>
  );
}