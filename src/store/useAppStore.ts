import { create } from "zustand";
import type { Account, Ring, CaseRun, GraphEdge, ValidationResult, Settings, InterventionAction, MitigationSummary } from "@/lib/types";
import {
  sampleAccounts,
  sampleRings,
  sampleEdges,
  sampleCases,
} from "@/lib/mockData";
import { validateCSV, analyzeCSV } from "@/lib/api";

interface AppState {
  hasAnalysis: boolean;
  cases: CaseRun[];
  currentCase: CaseRun | null;
  accounts: Account[];
  rings: Ring[];
  edges: GraphEdge[];

  uploadedFile: File | null;
  isProcessing: boolean;
  processingTime: number | null;
  validationResult: ValidationResult | null;

  selectedAccountId: string | null;
  selectedRingId: string | null;
  ringFocusMode: boolean; // New focus mode state
  showWhyPanel: boolean;
  whyAccountId: string | null;

  settings: Settings;

  // Intervention state
  interventionScenario: InterventionAction[];
  mitigationSummary: MitigationSummary | null;

  setUploadedFile: (file: File | null) => void;
  validateFile: () => void;
  runAnalysis: () => Promise<void>;
  selectAccount: (id: string | null) => void;
  selectRing: (id: string | null) => void;
  setRingFocusMode: (active: boolean) => void; // New focus mode action
  openWhyPanel: (accountId: string) => void;
  closeWhyPanel: () => void;
  updateSettings: (s: Partial<Settings>) => void;
  resetAnalysis: () => void;
  loadSampleData: () => void;

  // Intervention actions
  addIntervention: (action: InterventionAction) => void;
  removeIntervention: (index: number) => void;
  previewIntervention: () => void;
  applyIntervention: () => void;
  resetIntervention: () => void;
}

const defaultSettings: Settings = {
  nodeLimit: 2000,
  defaultLayout: "force",
  defaultEdgeLabel: "none",
  aggregateEdges: true,
  cycleLengthMin: 3,
  cycleLengthMax: 5,
  fanThreshold: 10,
  timeWindowHours: 72,
  shellTxMin: 2,
  shellTxMax: 3,
  confidenceWeight: 0.5,
};

export const useAppStore = create<AppState>((set, get) => ({
  hasAnalysis: false,
  cases: [],
  currentCase: null,
  accounts: [],
  rings: [],
  edges: [],
  uploadedFile: null,
  isProcessing: false,
  processingTime: null,
  validationResult: null,
  selectedAccountId: null,
  selectedRingId: null,
  ringFocusMode: false,
  showWhyPanel: false,
  whyAccountId: null,
  settings: { ...defaultSettings },
  interventionScenario: [],
  mitigationSummary: null,

  setUploadedFile: (file) =>
    set({ uploadedFile: file, validationResult: null }),

  validateFile: async () => {
    const file = get().uploadedFile;
    if (!file) return;
    
    try {
      const response = await validateCSV(file);
      set({ validationResult: response.result });
    } catch (error) {
      console.error("[v0] Validation error:", error);
      set({
        validationResult: {
          columnsDetected: false,
          timestampValid: false,
          amountNumeric: false,
          amountPositive: false,
          duplicateTxCount: 0,
          rowsParsed: 0,
          invalidRows: 0,
          columns: [],
        },
      });
    }
  },

  runAnalysis: async () => {
    const file = get().uploadedFile;
    if (!file) return;
    
    set({ isProcessing: true });
    const start = performance.now();
    
    try {
      const response = await analyzeCSV(file);
      const elapsed = parseFloat(((performance.now() - start) / 1000).toFixed(1));
      
      const newCase: CaseRun = {
        ...response.case,
        processingTime: elapsed,
      };
      
      set({
        isProcessing: false,
        processingTime: elapsed,
        hasAnalysis: true,
        accounts: response.accounts,
        rings: response.rings,
        edges: response.edges,
        currentCase: newCase,
        cases: [newCase, ...get().cases],
        validationResult: response.validation || null,
      });
    } catch (error) {
      console.error("[v0] Analysis error:", error);
      set({
        isProcessing: false,
        hasAnalysis: false,
      });
      throw error;
    }
  },

  selectAccount: (id) => set({ selectedAccountId: id }),
  selectRing: (id) => set({ selectedRingId: id }),
  setRingFocusMode: (active) => set({ ringFocusMode: active }),
  openWhyPanel: (id) => set({ showWhyPanel: true, whyAccountId: id }),
  closeWhyPanel: () => set({ showWhyPanel: false, whyAccountId: null }),

  updateSettings: (s) =>
    set((state) => ({ settings: { ...state.settings, ...s } })),

  resetAnalysis: () =>
    set({
      hasAnalysis: false,
      currentCase: null,
      accounts: [],
      rings: [],
      edges: [],
      uploadedFile: null,
      processingTime: null,
      validationResult: null,
      selectedAccountId: null,
      selectedRingId: null,
      ringFocusMode: false,
    }),

  loadSampleData: () => {
    const c = sampleCases[0];
    set({
      hasAnalysis: true,
      currentCase: c,
      cases: sampleCases,
      accounts: sampleAccounts,
      rings: sampleRings,
      edges: sampleEdges,
      processingTime: c.processingTime,
      mitigationSummary: null,
      interventionScenario: [],
    });
  },

  addIntervention: (action) =>
    set((state) => ({
      interventionScenario: [...state.interventionScenario, action]
    })),

  removeIntervention: (index) =>
    set((state) => ({
      interventionScenario: state.interventionScenario.filter((_, i) => i !== index)
    })),

  previewIntervention: () => {
    const { currentCase, interventionScenario } = get();
    if (!currentCase) return;

    // Mock calculation of deltas
    const reductionFactor = interventionScenario.length * 0.12;
    const flowReduction = interventionScenario.length * 450000;

    set({
      mitigationSummary: {
        before: {
          riskScore: currentCase.riskExposure,
          suspiciousCount: currentCase.suspiciousCount,
          ringCount: currentCase.ringCount,
          flow: 12450000,
          disruption: 0
        },
        after: {
          riskScore: Math.max(15, currentCase.riskExposure - Math.round(reductionFactor * 60)),
          suspiciousCount: Math.max(0, currentCase.suspiciousCount - interventionScenario.length * 2),
          ringCount: Math.max(0, currentCase.ringCount - Math.round(interventionScenario.length * 0.8)),
          flow: Math.max(0, 12450000 - flowReduction),
          disruption: Math.min(100, interventionScenario.length * 15)
        }
      }
    });
  },

  applyIntervention: () => {
    const { mitigationSummary, currentCase } = get();
    if (!mitigationSummary || !currentCase) return;

    // Commit the preview to current case (mock)
    const updatedCase = {
      ...currentCase,
      riskExposure: mitigationSummary.after.riskScore,
      suspiciousCount: mitigationSummary.after.suspiciousCount,
      ringCount: mitigationSummary.after.ringCount,
    };

    set({
      currentCase: updatedCase,
      mitigationSummary: null,
      interventionScenario: [],
    });
  },

  resetIntervention: () => set({ interventionScenario: [], mitigationSummary: null }),
}));
