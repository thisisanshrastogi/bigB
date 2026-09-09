"use client";
import InspectorForm from './InspectorForm';

export default function InspectorRail() {
  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-24">
        <InspectorForm />
      </div>
    </div>
  );
}
