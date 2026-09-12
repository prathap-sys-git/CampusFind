import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import type { ClaimRecord } from '../../types';

export const ClaimsPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);

  const mockClaims: ClaimRecord[] = [
    {
      id: 'CLM-4819',
      itemId: 'item_102',
      itemTitle: 'Dark Blue Insulated Drink Flask (Hydro Flask)',
      itemType: 'found',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      submittedDate: '2026-09-10',
      status: 'approved',
      verificationDetails: 'Correctly verified Yosemite National Park sticker and dent on base.',
      hubPickupLocation: 'Central Library Front Circulation Desk (Window #2)',
    },
    {
      id: 'CLM-3921',
      itemId: 'item_107',
      itemTitle: 'White Wireless Earbud Charging Case (AirPods Pro)',
      itemType: 'found',
      imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80',
      submittedDate: '2026-09-09',
      status: 'under_review',
      verificationDetails: 'Submitted serial number matching reference database. Awaiting staff sign-off.',
      hubPickupLocation: 'Engineering Hall Department Security Office Room 102',
    },
  ];

  const getStatusBadge = (status: ClaimRecord['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" size="sm" dot>
            Approved - Ready for Pickup
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="pending" size="sm" dot>
            Under Staff Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="lost" size="sm" dot>
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm" dot>
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Recovery Claims
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track ownership verification progress and pick up approved belongings at campus hubs.
        </p>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {mockClaims.map((claim) => (
          <div
            key={claim.id}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={claim.imageUrl}
                alt={claim.itemTitle}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #{claim.id}
                  </span>
                  {getStatusBadge(claim.status)}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {claim.itemTitle}
                </h4>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Submitted {claim.submittedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {claim.hubPickupLocation}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setSelectedClaim(claim)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Claim Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Details Modal */}
      <Modal
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title={`Claim Verification #${selectedClaim?.id}`}
        description="Official campus recovery protocol record"
        maxWidth="md"
      >
        {selectedClaim && (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <img
                src={selectedClaim.imageUrl}
                alt={selectedClaim.itemTitle}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedClaim.itemTitle}
                </h5>
                <span className="text-xs text-slate-400">Submitted {selectedClaim.submittedDate}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Verification Proof Submitted
              </span>
              <p className="text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                {selectedClaim.verificationDetails}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Campus Pickup Location
              </span>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">{selectedClaim.hubPickupLocation}</span>
                  <span className="text-[11px] opacity-90">
                    Bring your physical student ID card or state driver's license.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast({
                    title: 'Pickup Voucher Ready',
                    description: `Voucher #${selectedClaim.id} saved to your device. Present at circulation desk.`,
                    type: 'success',
                  });
                  setSelectedClaim(null);
                }}
              >
                Save Pickup Voucher
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
