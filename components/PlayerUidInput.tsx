'use client';

import React, { useState } from 'react';
import { User, CheckCircle2, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { validatePlayerUID } from '@/lib/packages';

interface PlayerUidInputProps {
  playerUid: string;
  setPlayerUid: (uid: string) => void;
  inGameName: string;
  setInGameName: (ign: string) => void;
  onUidValidated: (isValid: boolean) => void;
}

export default function PlayerUidInput({
  playerUid,
  setPlayerUid,
  inGameName,
  setInGameName,
  onUidValidated,
}: PlayerUidInputProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [touched, setTouched] = useState(false);

  const validation = validatePlayerUID(playerUid);
  const isValid = validation.valid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    setPlayerUid(val);
    setTouched(true);
    const check = validatePlayerUID(val);
    onUidValidated(check.valid);
  };

  const handleUseSample = () => {
    const sample = '1077889123';
    setPlayerUid(sample);
    if (!inGameName) {
      setInGameName('RaiStar_FF');
    }
    setTouched(true);
    onUidValidated(true);
  };

  return (
    <div id="uid-input" className="scroll-mt-20 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E60012] text-white flex items-center justify-center font-extrabold text-sm">
            1
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">
              Enter Free Fire Player UID
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Diamonds will be credited directly to this account via official game server API
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#E60012] transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          {showGuide ? 'Hide UID Guide' : 'How to find your UID?'}
        </button>
      </div>

      {/* Guide accordion if open */}
      {showGuide && (
        <div className="mt-4 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700 space-y-2">
          <div className="font-bold text-zinc-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#E60012]" />
            How to find your Free Fire Player UID:
          </div>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-zinc-600">
            <li>Launch Free Fire on your mobile device.</li>
            <li>Tap on your Profile Avatar banner located at the top-left corner of the main lobby.</li>
            <li>Look below your player nickname for your 8 to 12-digit numeric Player UID.</li>
            <li>Tap the small copy icon next to the number and paste it in the box below.</li>
          </ol>
        </div>
      )}

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-5">
        {/* Player UID Input */}
        <div className="md:col-span-7">
          <label htmlFor="player-uid-field" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
            Player UID <span className="text-[#E60012]">*</span>
          </label>
          <div className="relative">
            <input
              id="player-uid-field"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={playerUid}
              onChange={handleChange}
              onBlur={() => setTouched(true)}
              placeholder="e.g. 1077889123 (8-12 digits)"
              className={`w-full px-4 py-3 text-base font-mono font-medium text-zinc-900 bg-zinc-50 border rounded-lg focus:outline-none focus:bg-white transition-all ${
                touched && !isValid
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : touched && isValid
                  ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  : 'border-zinc-300 focus:border-zinc-800'
              }`}
            />
            <div className="absolute right-3 top-3.5 flex items-center gap-1.5">
              {touched && isValid && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100 text-emerald-600" />
                  Valid
                </span>
              )}
              {touched && !isValid && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Invalid
                </span>
              )}
            </div>
          </div>
          {touched && !isValid ? (
            <p className="mt-1 text-xs text-red-600 font-medium">{validation.error}</p>
          ) : (
            <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Must be 8 to 12 digits numeric string</span>
              <button
                type="button"
                onClick={handleUseSample}
                className="text-[#E60012] hover:underline font-semibold"
              >
                Click to try Sample UID
              </button>
            </div>
          )}
        </div>

        {/* Optional In-Game Name */}
        <div className="md:col-span-5">
          <label htmlFor="ign-field" className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
            In-Game Nickname (Optional)
          </label>
          <div className="relative">
            <input
              id="ign-field"
              type="text"
              value={inGameName}
              onChange={(e) => setInGameName(e.target.value)}
              placeholder="e.g. RaiStar_FF"
              className="w-full px-4 py-3 text-sm text-zinc-900 bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-zinc-800 focus:bg-white transition-all"
            />
            <User className="w-4 h-4 text-zinc-400 absolute right-3 top-3.5" />
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            For personal order reference & delivery receipt
          </p>
        </div>
      </div>
    </div>
  );
}
