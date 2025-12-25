import logo from '@/assets/logo.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="MedioKart" className={`${sizeClasses[size]} rounded-lg object-cover`} />
      {showText && (
        <span className="text-xl font-bold">
          <span className="text-muted-foreground">MEDIO</span>
          <span className="text-primary">KART</span>
        </span>
      )}
    </div>
  );
}
