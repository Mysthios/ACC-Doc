import type { SessionContext } from "../types";
import { conditions } from "../types";

export function SessionFields({
  value,
  onChange,
  prefix,
  includeCondition = false,
  includeTemperatures = true,
}: {
  value: SessionContext;
  onChange: (next: SessionContext) => void;
  prefix: string;
  includeCondition?: boolean;
  includeTemperatures?: boolean;
}) {
  const set = (key: keyof SessionContext, text: string) =>
    onChange({ ...value, [key]: text });
  return (
    <div className="context-grid">
      <label>
        Versi game {prefix}
        <input
          value={value.gameVersion === "Unknown" ? "" : value.gameVersion}
          maxLength={40}
          placeholder="Contoh: 1.10.4"
          onChange={(e) => set("gameVersion", e.target.value)}
        />
      </label>
      <label>
        BoP {prefix}
        <select value={value.bop} onChange={(e) => set("bop", e.target.value)}>
          <option value="Unknown">Tidak diketahui</option>
          <option value="Standard">Standar</option>
          <option value="Custom">Custom</option>
        </select>
      </label>
      {includeCondition && (
        <label>
          Permukaan {prefix}
          <select
            value={value.condition}
            onChange={(e) => set("condition", e.target.value)}
          >
            <option value="Unknown">Tidak diketahui</option>
            {conditions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      )}
      <label>
        Racing line {prefix}
        <select
          value={value.racingLine}
          onChange={(e) => set("racingLine", e.target.value)}
        >
          <option value="Unknown">Belum diamati</option>
          <option value="Dry">Kering</option>
          <option value="Wet">Basah</option>
        </select>
      </label>
      {includeTemperatures && (
        <>
          <label>
            Suhu udara {prefix} (°C)
            <input
              inputMode="decimal"
              value={value.air}
              maxLength={40}
              placeholder="Belum diketahui"
              onChange={(e) => set("air", e.target.value)}
            />
          </label>
          <label>
            Suhu lintasan {prefix} (°C)
            <input
              inputMode="decimal"
              value={value.track}
              maxLength={40}
              placeholder="Belum diketahui"
              onChange={(e) => set("track", e.target.value)}
            />
          </label>
          <label>
            Grip {prefix}
            <input
              value={value.grip}
              maxLength={200}
              placeholder="Contoh: optimum"
              onChange={(e) => set("grip", e.target.value)}
            />
          </label>
        </>
      )}
    </div>
  );
}
