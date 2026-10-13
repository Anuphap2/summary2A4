export const initialPagesData = [
  {
    id: 'page-1',
    pageNumber: 1,
    title: 'สรุปสอบปลายภาค - หน้า 1 (คำนวณ, ภาพดิจิทัล & การจำรูปแบบ)',
    subtitle: 'สูตรเขียนแบบสมการตรง อัดแน่นด้วย | และไฮไลท์สี ประหยัดพื้นที่ A4 สูงสุด',
    tagColor: 'lilac', // figma pastel: lilac
    accentColor: '#4f46e5',
    columns: 2,
    cards: [
      {
        id: 'card-1',
        title: '🧮 1. รวมสูตรคำนวณสำคัญ (K-NN, ขนาดไฟล์, คลื่น)',
        tag: 'คำนวณ & สูตร',
        colorTheme: 'lilac',
        content: `• <b>K-NN Distance (Euclidean):</b>
[formula]d = √[ (x₂ - x₁)² + (y₂ - y₁)² ][/formula]
• <b>1-NN:</b> <mark style="background-color: #fef08a;">จุดใกล้สุด ตอบทันที</mark> | <b>3-NN:</b> <mark style="background-color: #bbf7d0;">ใกล้สุด 3 ลำดับแรก ด้วย Majority Vote</mark> | <b>โจทย์:</b> คำนวณ d เทียบตารางหนัง
• <b>ขนาดไฟล์ภาพ (Raw Size):</b>
[formula]ขนาดไฟล์ (Bits) = กว้าง(W) × ยาว(H) × Bit Depth[/formula]
• <b>สเต็ปแปลง:</b> <mark style="background-color: #fed7aa;">Bits ÷ 8 = Bytes → ÷ 1024 = KB → ÷ 1024 = MB</mark>
• <b>ความลึกบิต:</b> ขาวดำ = 1 บิต | Grayscale = 8 บิต (256 เทา) | RGB = 24 บิต (8×3)
• <b>คลื่นแสง & ดิจิทัล:</b> [formula]F = 1/T  |  V = F × λ  |  ความเร็วแสง = 3 × 10⁸ m/s[/formula] | <b>Nyquist:</b> <mark style="background-color: #fbcfe8;">fs ≥ 2·fmax กัน Aliasing</mark>`
      },
      {
        id: 'card-2',
        title: '🖼️ 2. ภาพดิจิทัล & เทคนิคการปรับปรุงภาพ',
        tag: 'ทฤษฎีภาพ',
        colorTheme: 'lime',
        content: `• <b>Analog → Digital:</b> 1.<b>Sampling:</b> สุ่มพิกัดพิกเซล (X, Y) | 2.<b>Quantization:</b> แปลงความเข้มแสงเป็นระดับตัวเลข (0–255)
• <b>4 ชนิดภาพดิจิทัล:</b>
• <b>Binary (1-bit):</b> 0/1 เล็กสุด ลายนิ้วมือ | <b>Grayscale (8-bit):</b> <mark style="background-color: #fef08a;">256 ระดับเทา (0=ดำ, 255=ขาว)</mark>
• <b>True Color RGB (24-bit):</b> แม่สีช่องละ 8 บิต รวม 16.7 ล้านสี | <b>Indexed Color:</b> เก็บดัชนี 8 บิต อ้างอิงตารางสี (GIF)
• <b>Bitmap vs Vector:</b>
• <b>Bitmap:</b> พิกเซล ขยายแล้วแตก ภาพถ่ายสมจริง | <b>Vector:</b> <mark style="background-color: #bbf7d0;">สมการเรขาคณิต ขยายไม่แตก โลโก้</mark>
• <b>4 เทคนิคปรับแต่ง:</b> 1.<b>Anti-aliasing:</b> เกลี่ยจุดสีลดรอยหยัก | 2.<b>Transformation:</b> ย่อ/ขยาย/หมุน/เลื่อน | 3.<b>Dithering:</b> กระจายจุดสีหลอกตา | 4.<b>Rendering:</b> ลงสี แสงเงา 3D`
      },
      {
        id: 'card-3',
        title: '🎨 3. ระบบแม่สี & ภาพเคลื่อนไหว (Animation)',
        tag: 'สี & สื่อผสม',
        colorTheme: 'coral',
        content: `• <b>Additive vs Subtractive:</b>
• <b>Additive (ระบบแสง 3 สี):</b> <mark style="background-color: #bae6fd;">RGB (แดง เขียว น้ำเงิน)</mark> รวมกัน = ขาว | ไม่มีแสง = ดำ | ใช้กับจอภาพ/ทีวี
• <b>Subtractive (ระบบสารสี 4 สี):</b> <mark style="background-color: #fed7aa;">CMYK (ฟ้า ม่วงแดง เหลือง ดำ)</mark> รวมกัน = ดำ | ใช้กับงานพิมพ์
• <b>ความสว่าง, คอนทราสต์ & Point Processing:</b>
• <b>Brightness (B):</b> ค่าเฉลี่ยแสง | <b>Contrast (C):</b> ส่วนเบี่ยงเบนมาตรฐานกระจายแสง
• <b>ปรับเชิงเส้น:</b> [formula]g(x,y) = a·f(x,y) + b[/formula] (a คอนทราสต์, b สว่าง) | <b>Negative:</b> [formula]g(x,y) = 255 - f(x,y)[/formula]
• <b>Animation:</b> <mark style="background-color: #bbf7d0;">ถูก/เร็วสุด = Computer 2D/3D</mark> | <mark style="background-color: #fbcfe8;">แพง/ช้าสุด = Hand-drawn วาดมือ 24fps</mark> & Stop Motion`
      },
      {
        id: 'card-4',
        title: '🔍 4. การจำรูปแบบ & การคิดเชิงนามธรรม',
        tag: 'Pattern & CT',
        colorTheme: 'cream',
        content: `• <b>นิยาม Pattern Recognition:</b>
• <b>Feature:</b> คุณลักษณะเด่นตัวแทนข้อมูล | <b>Feature Extraction:</b> สกัดฟีเจอร์เด่น
• <b>Feature Selection:</b> คัดเลือกฟีเจอร์ที่ดีที่สุด | <b>Classifier:</b> ฟังก์ชันจัดวัตถุเข้าคลาส | <b>Label:</b> ป้ายกำกับเฉลย
• <b>Abstraction (คิดเชิงนามธรรม):</b>
• <mark style="background-color: #fef08a;">โฟกัสเฉพาะสาระสำคัญที่เป็นแก่น ตัดรายละเอียดฉากหลัง (Background) ทิ้งไป</mark>
• <b>4 ทักษะ Computational Thinking:</b>
• 1.<b>Decomposition:</b> แตกปัญหาใหญ่เป็นย่อย | 2.<b>Pattern Recognition:</b> สังเกตรูปแบบความเหมือนต่าง
• 3.<b>Abstraction:</b> ตัดสิ่งไม่จำเป็น | 4.<b>Algorithm Design:</b> ลำดับขั้นตอนวิธีแก้ปัญหา`
      }
    ]
  },
  {
    id: 'page-2',
    pageNumber: 2,
    title: 'สรุปสอบปลายภาค - หน้า 2 (หุ่นยนต์, โครงข่ายประสาท & ระบบผู้เชี่ยวชาญ)',
    subtitle: 'เน้นการจำแนกประเภท ศัพท์เฉพาะทาง AI และการเปรียบเทียบสถาปัตยกรรม',
    tagColor: 'mint', // figma pastel: mint
    accentColor: '#059669',
    columns: 2,
    cards: [
      {
        id: 'card-5',
        title: '🤖 5. วิทยาการหุ่นยนต์ (Robotics)',
        tag: 'วิทยาการหุ่นยนต์',
        colorTheme: 'mint',
        content: `• <b>5 องค์ประกอบหุ่นยนต์:</b> 1.<b>Mechanical:</b> โครงสร้าง | 2.<b>Power:</b> แหล่งพลังงาน | 3.<b>Sensor:</b> ส่วนรับรู้สิ่งแวดล้อม | 4.<b>Effector/Actuator:</b> ส่วนกระทำ (แขน/ล้อ) | 5.<b>Intelligent:</b> สมองกลประมวลผล
• <b>สถาปัตยกรรมระบบควบคุม:</b>
• <b>Reactive Control:</b> Sensor → Effector ทันที | <mark style="background-color: #fbcfe8;">ไม่มี AI ไม่มีความจำ ไม่เก็บอดีต</mark> ไวต่อสภาพแวดล้อม
• <b>Subsumption Architecture:</b> <mark style="background-color: #bbf7d0;">นำ AI มาใช้ (ANN, Fuzzy) วางแผนได้ เก็บบันทึกข้อมูลอดีต</mark> (กินแรม)
• <b>ประเภทหุ่นยนต์:</b> <b>Fixed:</b> แขนกลอยู่กับที่ | <b>Mobile:</b> เคลื่อนที่ได้ | <b>Humanoid:</b> เลียนแบบคนทั้งตัว | <b>Cyborg:</b> สิ่งมีชีวิตฝังกลไก | <b>Actroid:</b> หน้าตาผิวหนังเหมือนคนจริง | <b>Nanorobot:</b> ระดับนาโน
• <b>ภาษา:</b> <b>Behavior:</b> Rule-based กับ Subsumption | <b>GRL:</b> Functional สำหรับ FSM | <b>Alisp:</b> พัฒนาจาก Lisp เรียนรู้ได้เอง`
      },
      {
        id: 'card-6',
        title: '🧠 6. โครงข่ายประสาทเทียม & Deep Learning',
        tag: 'Neural Network',
        colorTheme: 'lilac',
        content: `• <b>ชีววิทยา vs คอมพิวเตอร์:</b>
• เดนไดรท์ = ข้อมูลนำเข้า (xᵢ) | ไซแนปส์ = ค่าน้ำหนัก (wᵢ) | นิวรอน = ผลรวมถ่วงน้ำหนัก (Σwᵢxᵢ) + Activation | แอ็กซอน = เอาต์พุต (y)
• <b>สถาปัตยกรรม & การเทรน:</b>
• <b>Feedforward:</b> วิ่งทิศทางเดียว Input → Hidden → Output | <b>Feedback:</b> ป้อนย้อนกลับคำนวณซ้ำ
• <b>Backpropagation:</b> <mark style="background-color: #fef08a;">ส่ง Error ย้อนกลับด้วย Gradient Descent ปรับ Weight (Δw)</mark>
• <b>Activation Functions:</b>
• <b>Step:</b> 0 หรือ 1 ตาม Threshold | <b>Sigmoid:</b> [formula]f(x) = 1/(1+e⁻ˣ)[/formula] บีบ [0, 1] กราฟ S
• <b>ReLU:</b> [formula]f(x) = max(0, x)[/formula] ลบปัด 0 บวกคงเดิม <mark style="background-color: #bbf7d0;">แก้ Vanishing Gradient นิยมสุด</mark>
• <b>Softmax:</b> บีบเอาต์พุตหลายโหนดเป็นความน่าจะเป็น รวมได้ 1 | <b>Epoch:</b> เทรนครบ 1 รอบเต็ม
• <b>CNN:</b> สกัด Spatial Features เหมาะที่สุดกับ <mark style="background-color: #bae6fd;">งานภาพ (Computer Vision)</mark>`
      },
      {
        id: 'card-7',
        title: '📚 7. รูปแบบการเรียนรู้ (Machine Learning)',
        tag: 'Machine Learning',
        colorTheme: 'lime',
        content: `• <b>4 ประเภทการเรียนรู้:</b>
• 1.<b>Supervised Learning:</b> <mark style="background-color: #fef08a;">มี Feature + Label (มีครูตรวจเฉลย)</mark> เช่น Classification, Regression
• 2.<b>Unsupervised Learning:</b> <mark style="background-color: #bbf7d0;">ไม่มี Label (หาแพทเทิร์นเอง)</mark> เช่น Clustering จัดกลุ่มพันธุ์สัตว์
• 3.<b>Semi-supervised:</b> ผสมข้อมูลมีเฉลยน้อย + ไม่มีเฉลยมาก ช่วยประหยัดต้นทุน
• 4.<b>Reinforcement Learning:</b> ลองผิดลองถูก (Trial & Error) มีรางวัล (Reward) และบทลงโทษ (Penalty)`
      },
      {
        id: 'card-8',
        title: '💡 8. ระบบผู้เชี่ยวชาญ & การจัดการข้อมูล',
        tag: 'Expert Systems',
        colorTheme: 'coral',
        content: `• <b>ระบบผู้เชี่ยวชาญ (Expert System):</b> จำลองการตัดสินใจของผู้เชี่ยวชาญ
• <b>5 ส่วนหลัก:</b> 1.<b>Knowledge Base:</b> กฎ IF-THEN | 2.<b>Inference Engine:</b> เครื่องอนุมานตรรกะ | 3.<b>Acquisition:</b> ดึงความรู้มาใส่ | 4.<b>Explanation:</b> อธิบายเหตุผล | 5.<b>UI:</b> ติดต่อผู้ใช้
• <b>ประเภท ES:</b>
• <b>Rule-based:</b> กฎชัดเจน IF-THEN | <b>Fuzzy ES:</b> <mark style="background-color: #fed7aa;">ตรรกะคลุมเครือ ค่าความจริง [0, 1]</mark> จัดการคำกำกวม | <b>Case-based (CBR):</b> เทียบเคียงกรณีศึกษาเดิม
• <b>ลักษณะเฉพาะ:</b> <b>Deterministic:</b> ผลลัพธ์แน่นอน 100% ไร้สุ่ม | <b>Probabilistic:</b> มีความน่าจะเป็น | <b>Static:</b> ขึ้นกับอินพุตปัจจุบัน | <b>Data Mining:</b> ขุดหารูปแบบในฐานข้อมูลยักษ์`
      }
    ]
  }
];

export const COLOR_THEMES = [
  { id: 'lime', name: 'Lime Pastel', bg: '#f4fae8', border: '#cce69b', accent: '#4d7c0f', chip: '#dceeb1' },
  { id: 'lilac', name: 'Lilac Pastel', bg: '#f6f2fd', border: '#d4c2f8', accent: '#6d28d9', chip: '#c5b0f4' },
  { id: 'mint', name: 'Mint Pastel', bg: '#eef8f1', border: '#b2e2bc', accent: '#047857', chip: '#c8e6cd' },
  { id: 'coral', name: 'Coral Pastel', bg: '#fdf3ed', border: '#f7c2aa', accent: '#c2410c', chip: '#f3c9b6' },
  { id: 'cream', name: 'Cream Warm', bg: '#fbf8ee', border: '#ebdcb9', accent: '#b45309', chip: '#f4ecd6' },
  { id: 'pink', name: 'Pink Rose', bg: '#fcf2f2', border: '#f1bebe', accent: '#be123c', chip: '#efd4d4' },
  { id: 'mono', name: 'Monochrome Clean', bg: '#ffffff', border: '#e5e7eb', accent: '#111827', chip: '#f3f4f6' }
];

export const FONT_SIZES = [
  { id: 'ultra-dense', name: 'จิ๋วมาก (8.5px)', class: 'text-[8.5px] leading-[1.25]', cardPadding: 'p-1', gap: 'gap-1' },
  { id: 'normal', name: 'ปกติ (9.5px) - แนะนำ', class: 'text-[9.5px] leading-[1.28]', cardPadding: 'p-1.5', gap: 'gap-1.5' },
  { id: 'comfortable', name: 'สบายตา (10.5px)', class: 'text-[10.5px] leading-[1.32]', cardPadding: 'p-2', gap: 'gap-2' }
];
