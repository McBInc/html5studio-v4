'use client';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldAlert, Smartphone } from 'lucide-react';

export default function MasterSetup() {
  // This is the "Shared Secret" between your phone and your server
  const secret = "H5STUDIO_V5_MASTER_2026_ALPHA_NODE";
  const otpauth = `otpauth://totp/HTML5Studio:MasterAdmin?secret=${secret}&issuer=HTML5Studio`;

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-[#161b22] border border-orange-500/30 p-10 rounded-[2.5rem] text-center shadow-2xl">
        <ShieldAlert size={48} className="text-orange-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">MFA INITIALIZATION</h1>
        <p className="text-gray-400 text-sm mb-10 leading-relaxed uppercase tracking-widest">
          Scan the encrypted key below into <br/> 
          <span className="text-white">Google Authenticator</span>
        </p>

        <div className="bg-white p-6 rounded-3xl inline-block mb-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <QRCodeSVG value={otpauth} size={200} />
        </div>

        <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-t border-white/5 pt-8">
          <Smartphone size={14} />
          Node ID: MASTER_ALPHA_01
        </div>
      </div>
    </div>
  );
}