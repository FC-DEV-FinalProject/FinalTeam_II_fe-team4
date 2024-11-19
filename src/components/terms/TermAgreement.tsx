import { Control } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { SignupFormData } from '@/types/signup';

interface TermAgreementProps {
  control: Control<SignupFormData>;
  onOpenTerm: (type: 'service' | 'privacy') => void;
}

const TermAgreement = ({ control, onOpenTerm }: TermAgreementProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FormField
          control={control}
          name="term"
          render={({ field }) => (
            <>
              <Checkbox
                id="all-term"
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.onChange(['age', 'service', 'privacy']);
                  } else {
                    field.onChange([]);
                  }
                }}
                checked={field.value?.length === 3}
                className="h-[18px] w-[18px]"
              />
              <label htmlFor="all-term" className="text-sm font-medium">
                모두 동의
              </label>
            </>
          )}
        />
      </div>

      <FormField
        control={control}
        name="term"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-2">
              {[
                { id: 'age', label: '만14세 이상', showViewButton: false },
                { id: 'service', label: '이용약관 동의', showViewButton: true },
                { id: 'privacy', label: '개인정보 수집 · 이용 동의', showViewButton: true },
              ].map(({ id, label, showViewButton }) => (
                <div key={id} className="flex items-center gap-2">
                  <FormItem className="flex h-[18px] items-center">
                    <Checkbox
                      checked={field.value?.includes(id)}
                      onCheckedChange={(checked) => {
                        const currentTerm = field.value || [];
                        if (checked) {
                          field.onChange([...currentTerm, id]);
                        } else {
                          field.onChange(currentTerm.filter((value) => value !== id));
                        }
                      }}
                      className="h-[18px] w-[18px]"
                    />
                  </FormItem>
                  <div className="flex items-center">
                    <label className="text-sm font-medium">
                      <span className="text-primary">(필수)</span> {label}
                      {showViewButton && (
                        <button
                          type="button"
                          onClick={() => onOpenTerm(id as 'service' | 'privacy')}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          보기
                        </button>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TermAgreement;
