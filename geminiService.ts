
import { GoogleGenAI } from "@google/genai";
import { UserIdentity, Confession, Goal, UserStats } from "./types";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: API Key not found. Check Vercel 'VITE_GEMINI_API_KEY' setting.");
    throw new Error("API Key no configurada.");
  }
  return new GoogleGenAI({ apiKey });
};


const COACH_SYSTEM_INSTRUCTION = `
ERES: "Rompe el Ciclo", un mentor real, humano y directo. No eres un robot, ni un académico. Hablas como una persona normal que entiende el dolor porque lo ha visto mil veces.

TU OBJETIVO: Destrabar al usuario. No dar cátedra.

REGLAS DE ORO (A CUMPLIR O MUERES):
1. RESPUESTAS CORTAS: Máximo 2-3 oraciones por idea. Si escribes un párrafo largo, fallaste.
2. CERO TITULOS/FORMATO: No uses negritas excesivas, ni "H1", ni "Capítulo X". Escribe como si fuera un chat de Whatsapp serio.
3. LENGUAJE SIMPLE: Nada de "ROI emocional" o palabras raras. Usa "costo", "dolor", "ganancia". Habla claro.
4. EMPATÍA + VERDAD: Primero valida ("Te entiendo, es jodido estar ahí"), luego golpea con la verdad ("Pero seguir llorando no lo arregla").
5. ATAQUE AL DOLOR: Identifica qué le duele y úsalo para moverlo.

EJEMPLO DE TONO:
Mal: "Analizando tu situación, detecto un déficit de productividad. Te sugiero implementar..."
Bien: "Mira, te estás mintiendo. Dices que no tienes tiempo, pero te pasaste 2 horas en Instagram. ¿Qué estás evitando enfrentar hoy?"

PROTOCOLO DE PRIVACIDAD:
Si preguntan por sus datos: "Todo queda en tu teléfono. Yo no guardo nada, ni nadie más lo ve."
`;

export const getCoachResponseStream = async (
  userMessage: string,
  history: { role: string, parts: { text: string }[] }[] = [],
  user: UserIdentity,
  logs: Confession[] = [],
  goals: Goal[] = [],
  stats: UserStats | null = null,
  onChunk: (text: string) => void
) => {
  const today = new Date().toISOString().split('T')[0];

  // Resumen de registros para que la IA sepa qué sesiones existen sin procesar el base64
  const logsSummary = logs.map(l => ({
    id: l.id,
    tipo: l.type,
    fecha: l.date,
    protocolo: l.sessionName,
    nota_reflexion: l.note
  })).slice(0, 10);

  const goalsSummary = goals.map(g => `${g.goal_title} (${g.progress_percentage}%)`).join(', ');
  const statsSummary = stats ? `Nivel ${Math.floor(stats.xp / 1000) + 1} | Racha: ${stats.current_streak} días` : 'Stats no disponibles';

  const userContext = `
    [OPERADOR_ID]: ${user.name || 'Desconocido'}
    [NORTE_ESTRATEGICO]: ${user.north_star || 'Sin definir'}
    [OBJETIVOS_ACTUALES]: ${goalsSummary}
    [ESTADO_OPERATIVO]: ${statsSummary}
    [REGISTROS_ACTUALES_RESUMEN]: ${JSON.stringify(logsSummary)}
    [FECHA_SISTEMA]: ${today}
    [ESTADO_SILO]: ACTIVO - LOCAL ONLY
  `;

  try {
    const result = await getAI().models.generateContentStream({
      model: 'gemini-flash-latest',
      contents: [
        { role: 'user', parts: [{ text: `INICIALIZANDO CONTEXTO SEGURO: ${userContext}` }] },
        { role: 'model', parts: [{ text: `Terminal de Silo Local activa. Analizando historial de registros RMC del operador ${user.name || ''}.` }] },
        ...history.concat([{ role: 'user', parts: [{ text: userMessage }] }])
      ],
      config: {
        systemInstruction: COACH_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    for await (const chunk of result) {
      // @ts-ignore
      const chunkText = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (error: any) {
    console.error("Error en stream:", error);
    onChunk(`... [ERROR: ${error.message || 'Desconocido'}. Verifica tu conexión o API Key] ...`);
  }
};

export const generateSalesScripts = async (product: string, target: string) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        { role: 'user', parts: [{ text: `Genera 3 scripts de venta agresivos para ${product} dirigidos a ${target}.` }] }
      ],
      config: { systemInstruction: "Eres un cerrador de ventas de alto nivel. Cero suavidad. Solo conversión." },
    });
    // @ts-ignore
    return typeof response.text === 'function' ? response.text() : response.text;
  } catch (error: any) {
    console.error("Error generating scripts:", error);
    return `Error: ${error.message}. Intenta de nuevo.`;
  }
};
