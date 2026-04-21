import logoonly from "@/assets/logoonly.png";

interface AdminLoadingProps {
  fullScreen?: boolean;
}

const AdminLoading = ({ fullScreen = false }: AdminLoadingProps) => {
  return (
    <div className={`flex items-center justify-center flex-col gap-6 p-4 relative overflow-hidden ${fullScreen ? 'min-h-screen bg-background' : 'min-h-[400px] py-20 bg-card/10 rounded-3xl my-4'}`}>
      {/* Subtle background - no halo */}
      {fullScreen && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(207,175,103,0.03),transparent_70%)]"></div>
      )}

      <div className="relative group">
        <div className="relative overflow-hidden">
          <img 
            src={logoonly} 
            alt="Loading..." 
            className="h-24 w-auto object-contain relative z-10" 
            style={{ 
              animation: 'floating 3s ease-in-out infinite, logo-shine 2s linear infinite'
            }}
          />
          {/* Shine Overlay Effect */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-50" style={{
            background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            mixBlendMode: 'overlay',
            animation: 'shine-move 3s infinite'
          }}></div>
        </div>
      </div>

      <div className="text-center space-y-3 z-10">
        <p className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-dark via-gold-medium to-gold-dark tracking-widest uppercase opacity-80">
          مجموعة فرسان
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-medium/40 animate-bounce delay-100"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-medium/40 animate-bounce delay-200"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-medium/40 animate-bounce delay-300"></span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes shine-move {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes logo-shine {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2) drop-shadow(0 0 5px rgba(207, 175, 103, 0.2)); }
        }
      `}} />
    </div>
  );
};

export default AdminLoading;
