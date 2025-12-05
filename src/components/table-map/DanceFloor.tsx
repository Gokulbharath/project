export const DanceFloor = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-2xl"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(32,32,74,.3), transparent)',
        border: '1px solid rgba(138,92,255,.15)',
      }}
    >
      <div className="text-center">
        <h3 className="text-sm font-bold text-text-dim uppercase tracking-widest opacity-50">
          Dance Floor
        </h3>
      </div>
    </div>
  );
};
