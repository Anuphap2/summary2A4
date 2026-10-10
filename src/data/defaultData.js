export const initialPagesData = [
  {
    id: 'page-1',
    pageNumber: 1,
    title: 'สรุปสอบปลายภาค - หน้า 1 (คำนวณ, ภาพดิจิทัล & การจำรูปแบบ)',
    subtitle: 'สูตรทั้งหมดเขียนแบบสมการตรง ไม่ใช้ LaTeX ป้องกันตัวอักษรเพี้ยน',
    tagColor: 'lilac', // figma pastel: lilac
    accentColor: '#4f46e5',
    columns: 2,
    cards: [
      {
        id: 'card-1',
        title: '🧮 1. รวมสูตรคำนวณสำคัญ (K-NN, ขนาดไฟล์, คลื่น)',
        tag: 'คำนวณ & สูตร',
        colorTheme: 'lilac',
        content: `• K-NN Distance (Euclidean):
[formula]d = √[ (x₂ - x₁)² + (y₂ - y₁)² ][/formula]
- <b>1-NN:</b> วัดระยะห่างไปยังทุกจุด จุดไหนใกล้สุด ตอบประเภทนั้นทันที
- <b>3-NN:</b> เลือกเพื่อนบ้านที่ใกล้สุด 3 ลำดับแรก แล้วตัดสินด้วยเสียงข้างมาก (Majority Vote)
- <i>โจทย์ข้อสอบ:</i> ทำนายประเภทหนัง (ฉากต่อสู้ x, ฉากรัก y) คำนวณ d เทียบตาราง

• สูตรคำนวณขนาดไฟล์ภาพ (Raw Size):
[formula]ขนาดไฟล์ (Bits) = กว้าง(W) × ยาว(H) × Bit Depth[/formula]
- <b>สเต็ปแปลงหน่วย:</b> Bits ÷ 8 = Bytes → ÷ 1,024 = KB → ÷ 1,024 = MB
- <b>ความลึกบิต:</b> ขาวดำ (Binary) = 1 บิต, เทา (Grayscale) = 8 บิต, สี (RGB) = 24 บิต (8×3)
- <i>ตัวอย่าง 512×512:</i> ขาวดำ = 0.033 MB, Grayscale = 0.262 MB, RGB = 0.786 MB

• คลื่นแสง & สัญญาณดิจิทัล:
[formula]F = 1 / T  |  T = 1 / F  |  V = F × λ  |  ความเร็วแสง V = 3 × 10⁸ m/s[/formula]
- <b>Nyquist Theorem:</b> ความถี่สุ่ม fs ≥ 2 · fmax ป้องกันสัญญาณเพี้ยน (Aliasing)`
      },
      {
        id: 'card-2',
        title: '🖼️ 2. ภาพดิจิทัล & เทคนิคการปรับปรุงภาพ',
        tag: 'ทฤษฎีภาพ',
        colorTheme: 'lime',
        content: `• การแปลง Analog → Digital:
1. <b>Sampling:</b> สุ่มตำแหน่งพิกัดเชิงพื้นที่กลายเป็นพิกเซล (X, Y)
2. <b>Quantization:</b> แปลงความเข้มแสงเป็นระดับตัวเลข (Gray Level เช่น 0–255)

• 4 ชนิดของภาพดิจิทัล:
- <b>Binary (1-bit):</b> มีแค่ 0 (ดำ) และ 1 (ขาว) ขนาดเล็กสุด เหมาะกับตัวหนังสือ/ลายนิ้วมือ
- <b>Grayscale (8-bit):</b> 256 ระดับเทา (0 = ดำสนิท, 255 = ขาวสว่าง)
- <b>True Color RGB (24-bit):</b> สีแดง-เขียว-น้ำเงิน ช่องละ 8 บิต รวม 16.7 ล้านสี
- <b>Indexed Color:</b> เก็บดัชนี 8 บิต อ้างอิง Color Table ไม่เกิน 256 สี นิยมใน GIF

• Bitmap vs Vector:
- <b>Bitmap:</b> สร้างจากพิกเซล ขยายแล้วแตก/เบลอ ภาพถ่ายสมจริง ไฟล์ใหญ่ตาม Resolution
- <b>Vector:</b> สร้างจากสมการคณิตศาสตร์/เรขาคณิต ขยายเท่าไรก็คมชัด ไฟล์เล็ก เหมาะกับโลโก้

• 4 เทคนิคปรับแต่งภาพ (ออกสอบแน่):
1. <b>Anti-aliasing:</b> เกลี่ยจุดสีรอยต่อเพื่อลบรอยหยัก ให้ขอบเส้นดูเรียบเนียน
2. <b>Transformation:</b> แปลงเชิงเรขาคณิต เช่น ย่อ/ขยาย หมุน เลื่อนตำแหน่ง ปรับสว่าง
3. <b>Dithering:</b> กระจายจุดสีหลอกสายตาเพื่อจำลองเฉดสีใหม่เมื่อจอมีสีจำกัด
4. <b>Rendering:</b> ลงสี คำนวณแสง เงา และพื้นผิวลงบนโครงร่างโมเดล 3D ให้สมจริง`
      },
      {
        id: 'card-3',
        title: '🎨 3. ระบบแม่สี & ภาพเคลื่อนไหว (Animation)',
        tag: 'สี & สื่อผสม',
        colorTheme: 'coral',
        content: `• ระบบแม่สี Additive vs Subtractive:
- <b>Additive (ระบบแสง 3 สี):</b> แม่สี <b>RGB</b> (แดง เขียว น้ำเงิน) รวมกันทุกสี = <b>สีขาว</b> ไม่มีแสง = <b>สีดำ</b> ใช้กับจอแสดงผล คอมพิวเตอร์ ทีวี
- <b>Subtractive (ระบบสารสี 4 สี):</b> แม่สี <b>CMYK</b> (ฟ้า-Cyan, ม่วงแดง-Magenta, เหลือง-Yellow, ดำ-Key/Black) รวมทุกสี = <b>สีดำ</b> ไม่มีสี = <b>สีขาว</b> ใช้กับงานพิมพ์ เครื่องพิมพ์

• ความสว่าง, คอนทราสต์ & Point Processing:
- <b>Brightness (B):</b> ค่าเฉลี่ยความสว่าง B = (1/MN) × Σ f(x, y)
- <b>Contrast (C):</b> ส่วนเบี่ยงเบนมาตรฐานของการกระจายแสง C = √[ (1/MN) × Σ(f(x, y) - B)² ]
- <b>ปรับเชิงเส้น:</b> g(x, y) = a · f(x, y) + b (a ปรับคอนทราสต์, b ปรับสว่าง)
- <b>Image Negative:</b> g(x, y) = 255 - f(x, y) (สลับดำเป็นขาว ขาวเป็นดำ)

• ภาพเคลื่อนไหว (Animation Costs):
- <b>ถูกสุด / เร็วสุด:</b> <b>Computer Animation</b> (2D/3D ดิจิทัล แก้ไขง่าย ลดต้นทุน)
- <b>แพงสุด / ใช้เวลานานสุด:</b> <b>Traditional Hand-drawn</b> (วาดมือทีละเฟรม 24 รูป/วินาที ใช้คนมหาศาล) และ Stop Motion คุณภาพสูง`
      },
      {
        id: 'card-4',
        title: '🔍 4. การจำรูปแบบ & การคิดเชิงนามธรรม',
        tag: 'Pattern & CT',
        colorTheme: 'cream',
        content: `• นิยาม Pattern Recognition:
- <b>Pattern Recognition:</b> ศาสตร์จำแนกวัตถุออกเป็นหมวดหมู่ (Classes) ตามรูปแบบ
- <b>Feature:</b> คุณลักษณะเด่นเชิงปริมาณ/คุณภาพที่เป็นตัวแทนของข้อมูล
- <b>Feature Extraction:</b> การสกัดดึงฟีเจอร์เด่นออกจากข้อมูลดิบ
- <b>Feature Selection:</b> การคัดเลือกฟีเจอร์ที่ดีที่สุดเพื่อใช้จำแนกอย่างแม่นยำ
- <b>Classifier:</b> ฟังก์ชัน/ตัวตัดสินใจจัดวัตถุเข้าสู่ Class
- <b>Label:</b> ป้ายกำกับเฉลยชื่อคลาสข้อมูล

• Abstraction (การคิดเชิงนามธรรม):
- กระบวนการคัดกรอง <b>โฟกัสเฉพาะสาระสำคัญที่เป็นแก่นของปัญหา และตัดรายละเอียดที่ไม่จำเป็นหรือฉากหลัง (Background) ทิ้งไป</b>
- <i>ตัวอย่าง:</i> ภาพคนเล่นเครื่องรอกออกกำลังกาย (Cable Press) สนใจแค่กลไกระบบรอก ตัดตัวคนและบรรยากาศในฟิตเนสทิ้ง

• 4 ทักษะแนวคิดเชิงคำนวณ (Computational Thinking):
1. <b>Decomposition:</b> แตกปัญหาใหญ่ออกเป็นปัญหาย่อยๆ
2. <b>Pattern Recognition:</b> สังเกตรูปแบบ ความเหมือน ความต่าง และแนวโน้ม
3. <b>Abstraction:</b> ตัดสิ่งที่ไม่จำเป็น สนใจเฉพาะสาระสำคัญ
4. <b>Algorithm Design:</b> ออกแบบขั้นตอนแก้ปัญหาแบบเป็นลำดับขั้น`
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
        content: `• 5 องค์ประกอบพื้นฐานหุ่นยนต์:
1. <b>Mechanical:</b> กลไก โครงสร้าง และฮาร์ดแวร์
2. <b>Power:</b> แหล่งจ่ายพลังงาน เช่น แบตเตอรี่, ไฟเลี้ยง
3. <b>Sensor:</b> ส่วนรับรู้สิ่งแวดล้อม (ตา-กล้อง, หู-ไมค์, ผิว-สัมผัส/เคมี)
4. <b>Effector / Actuator:</b> ส่วนกระทำตอบสนอง เช่น แขนกล มอเตอร์ ล้อ
5. <b>Intelligent / Control System:</b> สมองกลประมวลผลและการตัดสินใจ

• สถาปัตยกรรมระบบควบคุม:
- <b>Reactive Control:</b> รับข้อมูลจาก Sensor สั่งงาน Effector ทันที <b>ไม่มี AI ไม่มีความจำ ไม่เก็บอดีต</b> ตอบสนองรวดเร็วในสภาพแวดล้อม Dynamic
- <b>Subsumption Architecture:</b> <b>นำ AI มาใช้</b> (ANN, Fuzzy, GA) วางแผนได้ และ <b>เก็บบันทึกข้อมูลอดีตเป็นประสบการณ์</b> (ต้องใช้แรมเยอะ)

• ประเภทหุ่นยนต์ (คำศัพท์ข้อสอบ):
- <b>Fixed Robot:</b> หุ่นยนต์อยู่กับที่ เช่น แขนกลโรงงาน (Robotic Arm)
- <b>Mobile Robot:</b> เคลื่อนที่ได้ (ล้อ, ล้อสายพาน, ขา, บิน, ว่ายน้ำ)
- <b>Humanoid:</b> หุ่นยนต์รูปร่างเลียนแบบมนุษย์ทั้งตัว เช่น ASIMO
- <b>Cyborg (ไซบอร์ก):</b> สิ่งมีชีวิตที่มีชิ้นส่วนจักรกล/อิเล็กทรอนิกส์ฝังในร่างกาย
- <b>Actroid (แอคทรอยด์):</b> ฮิวแมนนอยด์ที่เน้นความเหมือนมนุษย์จริงขั้นสูง ทั้งผิวสัมผัสและการแสดงสีหน้า (มักเลียนแบบผู้หญิง)
- <b>Nanorobot (นาโนโรบอต):</b> ขนาดระดับนาโนเมตร ใช้ในการแพทย์ระดับเซลล์

• ภาษาโปรแกรมหุ่นยนต์:
- <b>Behavior Language:</b> (Rodney Brooks, 1990) ใช้ Rule-Based แบบ Real-time กับ Subsumption
- <b>GRL:</b> Functional programming สำหรับ Finite State Machine
- <b>Alisp:</b> พัฒนาจาก Lisp ช่วยให้หุ่นยนต์ตัดสินใจได้เองจากการเรียนรู้`
      },
      {
        id: 'card-6',
        title: '🧠 6. โครงข่ายประสาทเทียม & Deep Learning',
        tag: 'Neural Network',
        colorTheme: 'lilac',
        content: `• เทียบโครงข่ายชีววิทยากับคอมพิวเตอร์:
- เดนไดรท์ (Dendrite) = ข้อมูลนำเข้า (Inputs: xᵢ)
- จุดประสานประสาท (Synapses) = ค่าน้ำหนักความสำคัญ (Weights: wᵢ)
- เซลล์ประสาท (Neuron/Soma) = ผลรวมถ่วงน้ำหนัก (Summation: Σ wᵢxᵢ) + Activation Function
- แอ็กซอน (Axon) = ผลลัพธ์ขาออก (Output: y)

• สถาปัตยกรรม & การปรับค่าน้ำหนัก:
- <b>Feedforward:</b> ข้อมูลวิ่งไปข้างหน้าทิศทางเดียว Input → Hidden → Output
- <b>Feedback (Recurrent):</b> มีการป้อนผลลัพธ์ย้อนกลับมาคำนวณซ้ำ
- <b>Backpropagation:</b> อัลกอริทึมส่งค่า Error ย้อนกลับจาก Output ด้วยวิธี Gradient Descent เพื่อคำนวณปรับ Weight (Δw)

• Activation Functions (ฟังก์ชันกระตุ้น):
- <b>Binary Step / Threshold:</b> ตัดค่าเป็น 0 หรือ 1 ตามขีดเริ่มเปลี่ยน T
- <b>Sigmoid (S-curve):</b> f(x) = 1 / (1 + e⁻ˣ) บีบค่าช่วง [0, 1] กราฟตัว S
- <b>ReLU:</b> f(x) = max(0, x) ถ้าลบปัดเป็น 0 ถ้าบวกคงเดิม แก้อาการ Vanishing Gradient นิยมที่สุดใน Deep Learning
- <b>Softmax:</b> บีบเอาต์พุตหลายโหนดเป็นความน่าจะเป็น รวมกันได้ 1 (100%)

• คำศัพท์เฉพาะทาง Deep Learning:
- <b>Epoch:</b> รอบการเทรนที่โมเดลเรียนรู้ผ่านชุดข้อมูล Training Data ครบทุกตัวอย่าง 1 รอบเต็ม
- <b>CNN (Convolutional Neural Network):</b> สกัด Spatial Features เหมาะที่สุดกับ <b>งานภาพ (Image Processing / Computer Vision)</b>`
      },
      {
        id: 'card-7',
        title: '📚 7. รูปแบบการเรียนรู้ (Machine Learning)',
        tag: 'Machine Learning',
        colorTheme: 'lime',
        content: `• 1. Supervised Learning (แบบมีผู้สอน):
- ข้อมูลมีทั้ง Feature และ Label (เฉลยเปรียบเหมือนมีครูคอยตรวจคำตอบ)
- โมเดลจะตรวจเช็กคำตอบกับเฉลยเพื่อปรับแก้ Weight ให้ดีขึ้น (เช่น Classification, Regression)

• 2. Unsupervised Learning (แบบไม่มีผู้สอน / Clustering):
- ข้อมูลไม่มี Label หรือเฉลยล่วงหน้า
- โมเดลต้องหาความสัมพันธ์และจัดกลุ่มก้อนข้อมูลเองตามความคล้ายคลึง (เช่น การแบ่งกลุ่มสายพันธุ์พืช/สัตว์)

• 3. Semi-supervised Learning:
- ใช้ข้อมูลที่มี Label จำนวนน้อย ผสมกับข้อมูลไม่มี Label จำนวนมาก เพื่อช่วยประหยัดเวลาและต้นทุนการเตรียมข้อมูล

• 4. Reinforcement Learning (การเรียนรู้เสริมกำลัง):
- เรียนรู้ผ่านการลองผิดลองถูก (Trial & Error)
- ตัว Agent จะเรียนรู้กับสภาพแวดล้อมโดยได้รับ "รางวัล (Reward)" เมื่อทำถูก และ "บทลงโทษ (Penalty)" เมื่อทำผิด`
      },
      {
        id: 'card-8',
        title: '💡 8. ระบบผู้เชี่ยวชาญ & การจัดการข้อมูล',
        tag: 'Expert Systems',
        colorTheme: 'coral',
        content: `• ระบบผู้เชี่ยวชาญ (Expert System - ES):
- โปรแกรมจำลองการตัดสินใจของผู้เชี่ยวชาญเฉพาะทางโดยใช้ความรู้และการอนุมาน
- <b>5 ส่วนประกอบหลัก:</b>
1. <b>Knowledge Base:</b> ฐานความรู้และกฎเกณฑ์ (IF-THEN)
2. <b>Inference Engine:</b> เครื่องอนุมาน กลไกประมวลผลตรรกะเพื่อหาข้อสรุป
3. <b>Knowledge Acquisition:</b> ส่วนดึง/ถ่ายทอดความรู้จากคนมาใส่ระบบ
4. <b>Explanation Subsystem:</b> ส่วนอธิบายเหตุผลว่าทำไมถึงตอบเช่นนั้น
5. <b>User Interface:</b> ส่วนติดต่อประสานงานกับผู้ใช้งาน

• เปรียบเทียบประเภทระบบ ES:
- <b>Rule-based:</b> ใช้ตรรกะกฎชัดเจนตรงไปตรงมา IF (เงื่อนไข) THEN (ผลลัพธ์)
- <b>Fuzzy Expert System:</b> ใช้ตรรกศาสตร์คลุมเครือ ค่าความจริงอยู่ในช่วง [0, 1] สำหรับจัดการข้อมูลกำกวม เช่น "น้ำอุ่นปานกลาง", "รถวิ่งเร็วมาก"
- <b>Case-based Reasoning (CBR):</b> แก้ปัญหาใหม่โดยเทียบเคียงกับกรณีศึกษา/ประสบการณ์เดิมในอดีตที่คล้ายกัน

• ลักษณะเฉพาะของระบบ & ข้อมูล:
- <b>Deterministic:</b> ผลลัพธ์แน่นอน 100% ป้อนค่าเดิมได้ผลเดิมเสมอ ไร้การสุ่ม
- <b>Probabilistic (Stochastic):</b> มีความน่าจะเป็น/ความไม่แน่นอนเข้ามาเกี่ยวข้อง
- <b>Static System:</b> ผลลัพธ์ขึ้นกับอินพุตปัจจุบันเท่านั้น ไม่มีความจำอดีต
- <b>Data Mining:</b> การค้นหารูปแบบหรือความรู้ที่ซ่อนอยู่ในฐานข้อมูลขนาดใหญ่`
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
  { id: 'ultra-dense', name: 'จิ๋วมาก (8.5px)', class: 'text-[8.5px] leading-[1.25]', cardPadding: 'p-1.5', gap: 'gap-1.5' },
  { id: 'normal', name: 'ปกติ (9.5px) - แนะนำ', class: 'text-[9.5px] leading-[1.3]', cardPadding: 'p-2', gap: 'gap-2' },
  { id: 'comfortable', name: 'สบายตา (10.5px)', class: 'text-[10.5px] leading-[1.35]', cardPadding: 'p-2.5', gap: 'gap-2.5' }
];
