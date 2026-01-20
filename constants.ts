
import { Word } from './types';

export const VOCABULARY: Word[] = [
  // שיעור 1 - המילים המקוריות
  { id: '1', hebrew: 'אַחְרַאי', french: 'Responsable', category: 'Nom', lesson: 1 },
  { id: '2', hebrew: 'מְהַנְדֵּס', french: 'Ingénieur', category: 'Nom', lesson: 1 },
  { id: '3', hebrew: 'עָלֶה', french: 'Feuille', category: 'Nom', lesson: 1 },
  { id: '4', hebrew: 'תַּגְלִית', french: 'Découverte', category: 'Nom', lesson: 1 },
  { id: '5', hebrew: 'לְכַבּוֹת', french: 'Éteindre', category: 'Verbe', lesson: 1 },
  { id: '6', hebrew: 'לְהִתְלוֹנֵן עַל', french: 'Se plaindre de', category: 'Verbe', lesson: 1 },
  { id: '7', hebrew: 'לִמְנוֹעַ מ...', french: 'Empêcher de', category: 'Verbe', lesson: 1 },
  { id: '8', hebrew: 'לְפַטֵּר', french: 'Licencier / Renvoyer', category: 'Verbe', lesson: 1 },
  { id: '9', hebrew: 'לְהַשְׁקוֹת', french: 'Arroser', category: 'Verbe', lesson: 1 },
  { id: '10', hebrew: 'נָפוֹץ/ה', french: 'Commun(e) / Fréquent(e)', category: 'Adjectif', lesson: 1 },
  { id: '11', hebrew: 'ז"ל', french: 'Feu / De mémoire bénie', category: 'Divers', lesson: 1 },
  { id: '12', hebrew: 'מַשְׁמָעוּת', french: 'Signification', category: 'Nom', lesson: 1 },
  { id: '13', hebrew: 'לְהַשְׁקִיעַ', french: 'Investir', category: 'Verbe', lesson: 1 },
  { id: '14', hebrew: 'מַסְקָנָה', french: 'Conclusion', category: 'Nom', lesson: 1 },
  { id: '15', hebrew: 'מְסֻבָּךְ', french: 'Compliqué', category: 'Adjectif', lesson: 1 },
  { id: '16', hebrew: 'לְהִתְרַגֵּל', french: 'S\'habituer', category: 'Verbe', lesson: 1 },
  { id: '17', hebrew: 'מְצִיאוּת', french: 'Réalité', category: 'Nom', lesson: 1 },
  { id: '18', hebrew: 'יָעִיל', french: 'Efficace', category: 'Adjectif', lesson: 1 },
  { id: '19', hebrew: 'לְהַבְטִיחַ', french: 'Promettre', category: 'Verbe', lesson: 1 },
  { id: '20', hebrew: 'תּוֹצָאָה', french: 'Résultat', category: 'Nom', lesson: 1 },

  // שיעור 2 - מילים מהתמונה הקודמת
  { id: '21', hebrew: 'נֶזֶק', french: 'Dégât / Dommage', category: 'Nom', lesson: 2 },
  { id: '22', hebrew: 'עָלִים', french: 'Feuilles', category: 'Nom', lesson: 2 },
  { id: '23', hebrew: 'מַאֲבָק', french: 'Lutte / Combat', category: 'Nom', lesson: 2 },
  { id: '24', hebrew: 'גִּלּוּי', french: 'Découverte', category: 'Nom', lesson: 2 },
  { id: '25', hebrew: 'לְשַׁחְרֵר', french: 'Libérer / Relâcher', category: 'Verbe', lesson: 2 },
  { id: '26', hebrew: 'לְהִכָּשֵׁל', french: 'Échouer', category: 'Verbe', lesson: 2 },
  { id: '27', hebrew: 'לִמְנוֹעַ', french: 'Empêcher / Prévenir', category: 'Verbe', lesson: 2 },
  { id: '28', hebrew: 'לְגַלּוֹת', french: 'Découvrir', category: 'Verbe', lesson: 2 },
  { id: '29', hebrew: 'לִתְקֹף', french: 'Attaquer', category: 'Verbe', lesson: 2 },
  { id: '30', hebrew: 'נָפוֹץ', french: 'Commun / Fréquent', category: 'Adjectif', lesson: 2 },
  { id: '31', hebrew: 'עָשׂוּי', french: 'Susceptible de / Fait de', category: 'Adjectif', lesson: 2 },
  { id: '32', hebrew: 'הַמַּעֲרֶכֶת הַחִסּוּנִית', french: 'Le système immunitaire', category: 'Divers', lesson: 2 },

  // שיעור 3 - מילים מהתמונה החדשה
  { id: '33', hebrew: 'דְּמֻיּוֹת', french: 'Personnages', category: 'Nom', lesson: 3 },
  { id: '34', hebrew: 'מַאֲבָק', french: 'Lutte / Combat', category: 'Nom', lesson: 3 },
  { id: '35', hebrew: 'מוּסָרִיּוּת', french: 'Moralité', category: 'Nom', lesson: 3 },
  { id: '36', hebrew: 'מֶסֶר', french: 'Message', category: 'Nom', lesson: 3 },
  { id: '37', hebrew: 'נֶזֶק', french: 'Dommage / Dégât', category: 'Nom', lesson: 3 },
  { id: '38', hebrew: 'נִימוּס', french: 'Politesse', category: 'Nom', lesson: 3 },
  { id: '39', hebrew: 'כַּוָּנָה', french: 'Intention', category: 'Nom', lesson: 3 },
  { id: '40', hebrew: 'לְהִתְגַּבֵּר', french: 'Surmonter / Vaincre', category: 'Verbe', lesson: 3 },
  { id: '41', hebrew: 'מַצִּיג', french: 'Présente / Expose', category: 'Verbe', lesson: 3 },
  { id: '42', hebrew: 'מִזְדַּהִים', french: 'S\'identifient', category: 'Verbe', lesson: 3 },
  { id: '43', hebrew: 'לְהִתְאַמֵּץ', french: 'S\'efforcer / Faire un effort', category: 'Verbe', lesson: 3 },
  { id: '44', hebrew: 'אַלִּימִים', french: 'Violents', category: 'Adjectif', lesson: 3 },
  { id: '45', hebrew: 'מַרְדָּנִים', french: 'Rebelles', category: 'Adjectif', lesson: 3 },
  { id: '46', hebrew: 'שׁוֹבָב / ה', french: 'Espiègle / Coquin(e)', category: 'Adjectif', lesson: 3 },
];

export const COLORS = {
  primary: '#FF6AC1', // Pink
  secondary: '#FFD700', // Yellow
  accent: '#00F5FF', // Cyan
  bg: '#FFF4E0', // Beige
  success: '#50FA7B', // Green
  error: '#FF5555' // Red
};
