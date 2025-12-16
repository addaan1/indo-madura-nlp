import re

def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

def normalize(text):
    # Convert to lowercase and remove punctuation
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def calculate_wer(reference, hypothesis):
    r = reference.split()
    h = hypothesis.split()
    distance = levenshtein(r, h)
    return distance / len(r) if len(r) > 0 else 0

def calculate_cer(reference, hypothesis):
    # Remove spaces for CER calculation? Usually yes, or include them. 
    # Standard CER usually includes spaces as characters.
    r = reference
    h = hypothesis
    distance = levenshtein(r, h)
    return distance / len(r) if len(r) > 0 else 0

data = [
    # Row 1
    {
        "id_gt": "Minuman apa sih kok cara minumnya aneh rasanya aneh juga lagi",
        "id_hyp": "Minuman apa sih kok cara minumnya aneh rasanya aneh juga lagi",
        "mad_gt": "Enuman apa sih mak cara nginumma aneh, rassana aneh kiya pole",
        "mad_hyp": "Enuman apasih mak cara nginuma aneh rasana aneh kiyapoleh"
    },
    # Row 2
    {
        "id_gt": "Kemarin Dian membeli celana baru lewat aplikasi Lazada",
        "id_hyp": "Kemarin, dia membeli celana baru lewat aplikasi Lazada.",
        "mad_gt": "Be'eri' Dian melle salebber anyar lebet aplikasi Lazada",
        "mad_hyp": "Be'ari Dian Mele Saleh Beranjar Lebet Aplikasi Lazada"
    },
    # Row 3
    {
        "id_gt": "Nadia mencari kemeja untuk adiknya di uniqlo",
        "id_hyp": "Nadiah mencari ke media untuk adiknya di Uniqlo.",
        "mad_gt": "Nadia nyare kalambhi ghabay alek na e uniqlo",
        "mad_hyp": "Nadiya nyare kalambi gabai alet nae uniqlo"
    },
    # Row 4
    {
        "id_gt": "Dia biasanya membeli tisu paseo",
        "id_hyp": "dia biasanya membeli tisu Paseo",
        "mad_gt": "Oreng rua biasana melle tisu paseo",
        "mad_hyp": "Orang Ruwa Biasana Melle Tisu Paseo"
    },
    # Row 5
    {
        "id_gt": "Youtube semakin hari semakin banyak iklannya menyebalkan",
        "id_hyp": "Youtube semakin hari semakin banyak iklannya menyebalkan",
        "mad_gt": "Youtube sabban are sajen bannyak iklanna mabhellis",
        "mad_hyp": "YouTube Saban Are Sajen Banyak Iklan mabellis"
    },
    # Row 6
    {
        "id_gt": "Ayah biasanya memakai semir sepatu kiwi",
        "id_hyp": "Ayah biasanya memakai semmir sepatu kiwi.",
        "mad_gt": "Eppak biasana agghuy semir sapatu kiwi",
        "mad_hyp": "Epak biasa na aghuy semir sapatu kiwi"
    },
    # Row 7
    {
        "id_gt": "Karena lapar saya pesan indomie",
        "id_hyp": "karena lapar saya pesan Indomie",
        "mad_gt": "Polana lapar, engkok messen indomie.",
        "mad_hyp": "Polana lapar Angkok Masen Indomie"
    },
    # Row 8
    {
        "id_gt": "Ini adalah sop stengkel terenak di aceh tamiang.",
        "id_hyp": "Ini adalah Sop Stankle, terenak di Aceh Tamiyang.",
        "mad_gt": "Ariya sop stengkel se paleng nyaman e aceh tamiang.",
        "mad_hyp": "Ariya Sop Stenkle sepaling nyaman E Aceh Tamyang"
    },
    # Row 9
    {
        "id_gt": "Macet di mana-mana kalau lagi liburan",
        "id_hyp": "Macet dimana-mana kalau lagi liburan",
        "mad_gt": "Sella' e mandimman mun la preien",
        "mad_hyp": "Selah E mandiman mun la preian"
    },
    # Row 10
    {
        "id_gt": "Mau marah ke indosat Kok sinyalnya hilang melulu si",
        "id_hyp": "Mau marah ke Indosat, kok sinyalnya hilang melulu sih?",
        "mad_gt": "Terro aghighire ka indosat Mak sinyalla elang malolo si",
        "mad_hyp": "Terro agikire ka indosat ma sinyalah elang malolo si"
    }
]

print(f"{'No':<3} | {'Lang':<4} | {'WER':<6} | {'CER':<6} | {'Hypothesis (Normalized)'}")
print("-" * 65)

total_wer_id = 0
total_cer_id = 0
total_wer_mad = 0
total_cer_mad = 0

for i, row in enumerate(data):
    # Indonesian
    norm_id_gt = normalize(row['id_gt'])
    norm_id_hyp = normalize(row['id_hyp'])
    wer_id = calculate_wer(norm_id_gt, norm_id_hyp)
    cer_id = calculate_cer(norm_id_gt, norm_id_hyp)
    total_wer_id += wer_id
    total_cer_id += cer_id
    
    # Madurese
    norm_mad_gt = normalize(row['mad_gt'])
    norm_mad_hyp = normalize(row['mad_hyp'])
    wer_mad = calculate_wer(norm_mad_gt, norm_mad_hyp)
    cer_mad = calculate_cer(norm_mad_gt, norm_mad_hyp)
    total_wer_mad += wer_mad
    total_cer_mad += cer_mad
    
    print(f"{i+1:<3} | ID   | {wer_id:.2%} | {cer_id:.2%} | {norm_id_hyp}")
    print(f"{'':<3} | MAD  | {wer_mad:.2%} | {cer_mad:.2%} | {norm_mad_hyp}")
    print("-" * 65)

avg_wer_id = total_wer_id / len(data)
avg_cer_id = total_cer_id / len(data)
avg_wer_mad = total_wer_mad / len(data)
avg_cer_mad = total_cer_mad / len(data)

print("\n=== SUMMARY RESULTS ===")
print(f"Average Indonesian WER: {avg_wer_id:.2%}")
print(f"Average Indonesian CER: {avg_cer_id:.2%}")
print("-" * 25)
print(f"Average Madurese WER: {avg_wer_mad:.2%}")
print(f"Average Madurese CER: {avg_cer_mad:.2%}")
