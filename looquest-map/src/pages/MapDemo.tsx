import { useEffect, useState } from 'react';
import { DataStatusDot } from '../components/DataStatusDot';
import { ToiletMap } from '../components/ToiletMap';
import { fetchLiveToilets, loadToilets } from '../data/toiletData';
import type { Toilet } from '../data/types';

export function MapDemo() {
  const [toilets, setToilets] = useState<Toilet[]>(() => loadToilets());
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchLiveToilets().then((live) => {
      if (cancelled || !live) return;
      setToilets(live);
      setIsLive(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full w-full justify-center bg-neutral-200">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-white shadow-2xl">
        <DataStatusDot isLive={isLive} />
        <ToiletMap
          toilets={toilets}
          onSelect={(toilet) => console.log('Selected toilet:', toilet)}
        />
      </div>
    </div>
  );
}
