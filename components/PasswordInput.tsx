import React, { ChangeEvent } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function PasswordInput({
  className,
  value,
  onChange,
  placeholder,
}: {
  className?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        className={className}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        type={showPassword ? 'text' : 'password'}
      ></Input>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeIcon
            className="h-4 w-4"
            aria-hidden="true"
          />
        ) : (
          <EyeOffIcon
            className="h-4 w-4"
            aria-hidden="true"
          />
        )}
        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
      </Button>
    </div>
  );
}
