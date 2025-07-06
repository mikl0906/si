import React from "react";

type PresentationContextType = {
  request?: any;
}

const PresentationContext = React.createContext<PresentationContextType>({
  request: null,
});

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<any>(null);

  return (
    <PresentationContext.Provider value={{ state, setState }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = React.useContext(PresentationContext);
  if (!context) {
    throw new Error("usePresentation must be used within a PresentationProvider");
  }
  return context;
}