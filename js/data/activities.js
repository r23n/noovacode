
var X = [
  {
    tf: [
      {code:'System.out.println("Hi");',s:"هالسطر يطبع Hi بدون علامات التنصيص",a:true,why:"التنصيص يحدد النص بس وما ينطبع."},
      {s:"في جافا، كل أمر لازم ينتهي بفاصلة منقوطة ;",a:true,why:"الفاصلة المنقوطة تقول لجافا إن الأمر خلص."},
      {code:'System.out.println(Hello);',s:"هالسطر يطبع كلمة Hello",a:false,why:"بدون تنصيص، جافا تحسب Hello اسم صندوق مو موجود، فيطلع خطأ."},
      {s:"println تكتب الكلام وتنزل سطر جديد",a:true,why:"عشان كذا كل println تطبع في سطر لحالها."},
      {code:'system.out.println("Hi");',s:"هالسطر صحيح",a:false,why:"جافا تفرّق بين الحروف الكبيرة والصغيرة. لازم System بحرف S كبير."},
      {code:'System.out.println("A");\nSystem.out.println("B");',s:"A و B بينطبعون في سطر واحد",a:false,why:"كل println تنزل سطر، فكل حرف في سطر."},
      {code:'System.out.println("5 + 5");',s:"هالسطر يطبع 10",a:false,why:"داخل التنصيص كلام عادي، فينطبع 5 + 5 كما هو."},
      {code:'System.out.println("");',s:"هالسطر يطبع سطر فاضي",a:true,why:"التنصيص فاضي، فينطبع لا شي وينزل سطر."}
    ],
    match: [
      {code:'System.out.println("Go");',out:"Go"},
      {code:'System.out.println("5 + 5");',out:"5 + 5"},
      {code:'System.out.println(5 + 5);',out:"10"},
      {code:'System.out.println("Java");',out:"Java"}
    ],
    bugs: [
      {lines:['System.out.println("Hi");','System.out.println("Bye")'],bad:1,fix:'System.out.println("Bye");',why:"ناقص فاصلة منقوطة ; في آخر السطر."},
      {lines:['System.out.println("Start");','System.out.printn("Go");'],bad:1,fix:'System.out.println("Go");',why:"اسم الأمر println، وهنا ناقص حرف l."},
      {lines:['system.out.println("Hi");','System.out.println("Ok");'],bad:0,fix:'System.out.println("Hi");',why:"System لازم تبدأ بحرف S كبير."}
    ],
    cards: [
      {f:'System.out.println();',b:"أمر يطبع على الشاشة وينزل سطر جديد"},
      {f:'" "',b:"علامات التنصيص تحدد بداية النص ونهايته، وما تنطبع"},
      {f:';',b:"نهاية كل أمر في جافا"},
      {f:'System ≠ system',b:"جافا تفرّق بين الحرف الكبير والصغير"}
    ]
  },
  {
    tf: [
      {code:'int fuel = 50;',s:"سوينا صندوق اسمه fuel وفيه الرقم 50",a:true,why:"int نوع الصندوق، و fuel اسمه، و 50 قيمته."},
      {code:'int x = 5;\nx = 9;',s:"الحين x فيه 5 و 9 مع بعض",a:false,why:"الصندوق يحفظ قيمة وحدة بس، و9 حلّت مكان 5."},
      {code:'int speed = 100;\nSystem.out.println(speed);',s:"هالكود يطبع كلمة speed",a:false,why:"speed بدون تنصيص، فتنطبع قيمته 100."},
      {s:"اسم المتغير نختاره احنا",a:true,why:"نختار اسم واضح يوصف اللي داخله."},
      {code:'int 2fast = 10;',s:"هذا اسم متغير صحيح",a:false,why:"اسم المتغير ما يبدأ برقم."},
      {code:'int a = 3;\nint b = a;\nSystem.out.println(b);',s:"هالكود يطبع 3",a:true,why:"b أخذ نسخة من قيمة a، وهي 3."},
      {code:'int age = "20";',s:"هالسطر صحيح",a:false,why:"int للأرقام، و\"20\" نص لأنه بين تنصيص."},
      {code:'int score = 0;\nscore = 15;\nSystem.out.println(score);',s:"هالكود يطبع 15",a:true,why:"آخر قيمة انحطت في score هي 15."}
    ],
    match: [
      {code:'int a = 7;\nSystem.out.println(a);',out:"7"},
      {code:'int a = 7;\nSystem.out.println("a");',out:"a"},
      {code:'int a = 7;\na = 2;\nSystem.out.println(a);',out:"2"},
      {code:'int a = 4;\nint b = a;\nSystem.out.println(b);',out:"4"}
    ],
    bugs: [
      {lines:['int fuel = 50','System.out.println(fuel);'],bad:0,fix:'int fuel = 50;',why:"ناقص فاصلة منقوطة ; في آخر السطر."},
      {lines:['int speed = 10;','System.out.println(sped);'],bad:1,fix:'System.out.println(speed);',why:"اسم المتغير مكتوب غلط. لازم يكون نفس الاسم بالضبط."},
      {lines:['int level = "3";','System.out.println(level);'],bad:0,fix:'int level = 3;',why:"int للأرقام، فالرقم يكون بدون تنصيص."}
    ],
    cards: [
      {f:'int',b:"نوع الصندوق اللي يحفظ رقم صحيح"},
      {f:'=',b:"حط القيمة اللي على اليمين في الصندوق اللي على اليسار"},
      {f:'x = 9;',b:"تغيير قيمة صندوق موجود من قبل، بدون ما نكتب int مرة ثانية"},
      {f:'اسم المتغير',b:"نختاره احنا، وما يبدأ برقم"}
    ]
  },
  { 
    tf: [
      {code:'String name = "Nora";',s:"قيمة name هي Nora",a:true,why:"النص داخل التنصيص هو القيمة."},
      {code:'string city = "Riyadh";',s:"هالسطر صحيح",a:false,why:"String لازم تبدأ بحرف S كبير."},
      {code:'System.out.println("Hi" + "There");',s:"هالكود يطبع Hi There بمسافة بينهم",a:false,why:"+ تلصق بدون مسافة، فيطلع HiThere."},
      {code:'System.out.println("1" + "1");',s:"هالكود يطبع 11",a:true,why:"\"1\" نص، ولصق نصين يعطي 11."},
      {code:'String a = "Sky";\nSystem.out.println(a + "!");',s:"هالكود يطبع Sky!",a:true,why:"قيمة a لصقت مع علامة التعجب."},
      {s:"قيمة String لازم تكون بين تنصيص",a:true,why:"التنصيص هو اللي يخلي جافا تعرف إنه نص."},
      {code:'String x = Hello;',s:"هالسطر صحيح",a:false,why:"Hello بدون تنصيص، فجافا تدور صندوق بهالاسم وما تلقاه."},
      {code:'String n = "Ali";\nn = "Sara";\nSystem.out.println(n);',s:"هالكود يطبع Ali",a:false,why:"القيمة تغيرت إلى Sara، فتنطبع Sara."}
    ],
    match: [
      {code:'System.out.println("Hi" + "Ali");',out:"HiAli"},
      {code:'System.out.println("Hi " + "Ali");',out:"Hi Ali"},
      {code:'System.out.println("7" + "7");',out:"77"},
      {code:'System.out.println(7 + 7);',out:"14"}
    ],
    bugs: [
      {lines:['String name = Omar;','System.out.println(name);'],bad:0,fix:'String name = "Omar";',why:"قيمة النص لازم تكون بين تنصيص."},
      {goal:"Hi",lines:['String msg = "Hi";','System.out.println("msg");'],bad:1,fix:'System.out.println(msg);',why:"\"msg\" داخل تنصيص فبتنطبع كلمة msg. نشيل التنصيص عشان تنطبع القيمة."},
      {lines:['string city = "Doha";','System.out.println(city);'],bad:0,fix:'String city = "Doha";',why:"String تبدأ بحرف S كبير."}
    ],
    cards: [
      {f:'String',b:"نوع صندوق يحفظ نص (كلام)"},
      {f:'"Hi" + "Ali"',b:"+ بين نصين تلصقهم: HiAli"},
      {f:'"5"',b:"هذا نص مو رقم، لأنه بين تنصيص"},
      {f:'"Hi "',b:"المسافة داخل التنصيص جزء من النص وتنطبع"}
    ]
  },
  { 
    tf: [
      {code:'System.out.println(3 + 4);',s:"هالكود يطبع 7",a:true,why:"بدون تنصيص جافا تحسب: 3 + 4 = 7."},
      {code:'System.out.println(10 - 4 * 2);',s:"هالكود يطبع 12",a:false,why:"الضرب أول: 4 * 2 = 8، بعدين 10 - 8 = 2."},
      {s:"علامة الضرب في جافا هي ×",a:false,why:"علامة الضرب في البرمجة هي *"},
      {code:'System.out.println(20 / 4);',s:"هالكود يطبع 5",a:true,why:"20 قسمة 4 = 5."},
      {code:'int a = 5;\na = a * 2;\nSystem.out.println(a);',s:"هالكود يطبع 10",a:true,why:"أخذ القيمة القديمة 5 وضربها في 2."},
      {code:'System.out.println((2 + 3) * 2);',s:"هالكود يطبع 10",a:true,why:"الأقواس تنحسب أول: 5، بعدين 5 * 2 = 10."},
      {code:'System.out.println(7 / 2);',s:"هالكود يطبع 3.5",a:false,why:"القسمة بين أرقام صحيحة تشيل الكسر، فتطلع 3."},
      {code:'int x = 3;\nint y = x + x;\nSystem.out.println(y);',s:"هالكود يطبع 6",a:true,why:"3 + 3 = 6."}
    ],
    match: [
      {code:'System.out.println(2 + 3 * 4);',out:"14"},
      {code:'System.out.println((2 + 3) * 4);',out:"20"},
      {code:'System.out.println(9 - 3);',out:"6"},
      {code:'System.out.println(8 / 2);',out:"4"}
    ],
    bugs: [
      {lines:['int total = 5 x 3;','System.out.println(total);'],bad:0,fix:'int total = 5 * 3;',why:"علامة الضرب في جافا * مو x."},
      {goal:"12",lines:['int a = 10;','a = a - 2;','System.out.println(a);'],bad:1,fix:'a = a + 2;',why:"عشان نوصل 12 لازم نزيد 2 مو ننقص."},
      {lines:['int b = 8;','System.out.println(b + 2)'],bad:1,fix:'System.out.println(b + 2);',why:"ناقص فاصلة منقوطة ;"}
    ],
    cards: [
      {f:'*',b:"ضرب"},
      {f:'/',b:"قسمة، وبين الأرقام الصحيحة تشيل الكسر (7 / 2 = 3)"},
      {f:'( )',b:"اللي داخل الأقواس ينحسب أول"},
      {f:'a = a + 1;',b:"زيد قيمة a واحد"}
    ]
  },
  { 
    tf: [
      {code:'int x = 5;\nif (x > 3) {\n    System.out.println("Yes");\n}',s:"هالكود يطبع Yes",a:true,why:"5 أكبر من 3، فالشرط صحيح."},
      {s:"== و = لهم نفس المعنى",a:false,why:"= تحط قيمة، و == تسأل هل يساوي."},
      {code:'int t = 10;\nif (t < 5) {\n    System.out.println("Cold");\n}',s:"هالكود يطبع Cold",a:false,why:"10 مو أصغر من 5، فما ينطبع شي."},
      {code:'int a = 4;\nif (a == 4) {\n    System.out.println("Four");\n}',s:"هالكود يطبع Four",a:true,why:"a يساوي 4 فعلاً."},
      {s:"الكود داخل { } في if يشتغل بس إذا الشرط صحيح",a:true,why:"هذي فكرة if كلها."},
      {s:"!= معناها «لا يساوي»",a:true,why:"مثلاً 3 != 5 صحيح، لأن 3 ما يساوي 5."},
      {code:'int n = 10;\nif (n >= 10) {\n    System.out.println("Ten");\n}',s:"هالكود يطبع Ten",a:true,why:">= تشمل التساوي، و10 يساوي 10."},
      {code:'int h = 3;\nif (h > 5) {\n    System.out.println("A");\n}\nSystem.out.println("B");',s:"هالكود ما يطبع شي",a:false,why:"A ما تنطبع، لكن B برا الأقواس فتنطبع دايماً."}
    ],
    match: [
      {code:'int x = 9;\nif (x > 5) {\n    System.out.println("Big");\n}',out:"Big"},
      {code:'int x = 1;\nif (x > 5) {\n    System.out.println("Big");\n}',out:"ما ينطبع شي"},
      {code:'int x = 5;\nif (x == 5) {\n    System.out.println("Five");\n}',out:"Five"},
      {code:'int x = 2;\nif (x < 3) {\n    System.out.println("Small");\n}',out:"Small"}
    ],
    bugs: [
      {lines:['int x = 5;','if (x = 5) {','    System.out.println("Five");','}'],bad:1,fix:'if (x == 5) {',why:"للمقارنة نستخدم == مو ="},
      {goal:"Hot",lines:['int temp = 40;','if (temp < 30) {','    System.out.println("Hot");','}'],bad:1,fix:'if (temp > 30) {',why:"40 أكبر من 30، فالشرط الصح > عشان تنطبع Hot."},
      {lines:['int a = 3;','if a > 1 {','    System.out.println("Ok");','}'],bad:1,fix:'if (a > 1) {',why:"الشرط لازم يكون بين قوسين ( )."}
    ],
    cards: [
      {f:'if',b:"إذا: شغّل الكود لو الشرط صحيح"},
      {f:'==',b:"هل يساوي؟"},
      {f:'!=',b:"هل لا يساوي؟"},
      {f:'>=',b:"أكبر من أو يساوي"}
    ]
  },
  { 
    tf: [
      {code:'int o = 5;\nif (o > 20) {\n    System.out.println("Safe");\n} else {\n    System.out.println("Danger");\n}',s:"هالكود يطبع Danger",a:true,why:"5 مو أكبر من 20، فاشتغل جزء else."},
      {s:"في if و else ممكن يشتغل الجزئين مع بعض",a:false,why:"دايماً جزء واحد بس يشتغل."},
      {code:'int x = 10;\nif (x == 10) {\n    System.out.println("A");\n} else {\n    System.out.println("B");\n}',s:"هالكود يطبع B",a:false,why:"الشرط صحيح، فينطبع A."},
      {s:"else تحتاج شرط بين قوسين",a:false,why:"else ما لها شرط، تشتغل تلقائياً لو شرط if غلط."},
      {code:'int age = 18;\nif (age >= 18) {\n    System.out.println("Adult");\n} else {\n    System.out.println("Kid");\n}',s:"هالكود يطبع Adult",a:true,why:"18 يساوي 18، و >= تشمل التساوي."},
      {code:'int n = 0;\nif (n > 0) {\n    System.out.println("Plus");\n} else {\n    System.out.println("Zero");\n}',s:"هالكود يطبع Zero",a:true,why:"0 مو أكبر من 0، فاشتغل else."},
      {code:'int m = 60;\nif (m >= 60) {\n    System.out.println("Pass");\n} else {\n    System.out.println("Fail");\n}',s:"هالكود يطبع Fail",a:false,why:"60 يساوي 60، فالشرط صحيح وتنطبع Pass."},
      {s:"else تجي بعد قوس إغلاق if مباشرة",a:true,why:"نكتبها كذا: } else {"}
    ],
    match: [
      {code:'int x = 3;\nif (x > 5) {\n    System.out.println("Big");\n} else {\n    System.out.println("Small");\n}',out:"Small"},
      {code:'int x = 8;\nif (x > 5) {\n    System.out.println("Big");\n} else {\n    System.out.println("Small");\n}',out:"Big"},
      {code:'int x = 5;\nif (x == 5) {\n    System.out.println("Yes");\n} else {\n    System.out.println("No");\n}',out:"Yes"},
      {code:'int x = 6;\nif (x == 5) {\n    System.out.println("Yes");\n} else {\n    System.out.println("No");\n}',out:"No"}
    ],
    bugs: [
      {lines:['if (fuel > 0) {','    System.out.println("Go");','} else (fuel == 0) {','    System.out.println("Stop");','}'],bad:2,fix:'} else {',why:"else ما تاخذ شرط."},
      {goal:"Pass",lines:['int score = 70;','if (score < 60) {','    System.out.println("Pass");','} else {','    System.out.println("Fail");','}'],bad:1,fix:'if (score >= 60) {',why:"النجاح لما الدرجة 60 أو أكثر، فالشرط الصح >= 60."},
      {lines:['int x = 2;','if (x > 1) {','    System.out.println("A");','else {','    System.out.println("B");','}'],bad:3,fix:'} else {',why:"ناقص قوس } يسكّر جزء if قبل else."}
    ],
    cards: [
      {f:'else',b:"وإلا: يشتغل لو شرط if غلط"},
      {f:'if / else',b:"دايماً جزء واحد بس يشتغل"},
      {f:'} else {',b:"القوس يسكّر if، وبعده يبدأ جزء else"},
      {f:'else (x > 1)',b:"غلط! else ما تاخذ شرط"}
    ]
  },
  { 
    tf: [
      {code:'for (int i = 1; i <= 5; i++) {\n    System.out.println("Hi");\n}',s:"Hi تنطبع 5 مرات",a:true,why:"العداد يمشي من 1 إلى 5."},
      {code:'for (int i = 0; i < 5; i++) {\n}',s:"العداد هنا يبدأ من 1",a:false,why:"int i = 0 يعني يبدأ من 0."},
      {s:"i++ تزيد العداد واحد",a:true,why:"i++ مثل i = i + 1."},
      {code:'for (int i = 1; i <= 3; i++) {\n    System.out.println(i * 2);\n}',s:"هالكود يطبع 2 ثم 4 ثم 6",a:true,why:"كل مرة يطبع العداد مضروب في 2."},
      {code:'for (int i = 0; i <= 2; i++) {\n    System.out.println("X");\n}',s:"X تنطبع مرتين",a:false,why:"العداد 0 و1 و2، يعني 3 مرات."},
      {code:'for (int i = 5; i >= 1; i--) {\n    System.out.println(i);\n}',s:"هالكود يعد تنازلي من 5 إلى 1",a:true,why:"i-- تنقص العداد واحد كل مرة."},
      {s:"for تناسب لما نعرف كم مرة نبي نكرر",a:true,why:"لأن العداد يحدد عدد المرات."},
      {code:'for (int i = 1; i <= 3; i++) {\n}\nSystem.out.println("Done");',s:"Done تنطبع 3 مرات",a:false,why:"Done برا الأقواس، فتنطبع مرة وحدة بعد ما يخلص التكرار."}
    ],
    match: [
      {code:'for (int i = 1; i <= 3; i++) {\n    System.out.println(i);\n}',out:"1 2 3"},
      {code:'for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}',out:"0 1 2"},
      {code:'for (int i = 3; i >= 1; i--) {\n    System.out.println(i);\n}',out:"3 2 1"},
      {code:'for (int i = 1; i <= 3; i++) {\n    System.out.println(i * 10);\n}',out:"10 20 30"}
    ],
    bugs: [
      {goal:"Hi ثلاث مرات",lines:['for (int i = 1; i <= 4; i++) {','    System.out.println("Hi");','}'],bad:0,fix:'for (int i = 1; i <= 3; i++) {',why:"من 1 إلى 4 يعني 4 مرات. لازم الشرط i <= 3."},
      {lines:['for (int i = 1, i <= 3, i++) {','    System.out.println(i);','}'],bad:0,fix:'for (int i = 1; i <= 3; i++) {',why:"أجزاء for الثلاثة يفصل بينها ; مو فاصلة عادية."},
      {goal:"1 2 3",lines:['for (int i = 1; i <= 3; i--) {','    System.out.println(i);','}'],bad:0,fix:'for (int i = 1; i <= 3; i++) {',why:"i-- ينقص العداد، فما يوصل 3 أبداً ويكرر للأبد."}
    ],
    cards: [
      {f:'int i = 1',b:"بداية العداد"},
      {f:'i <= 3',b:"شرط الاستمرار: كمّل ما دام صحيح"},
      {f:'i++',b:"زيد العداد واحد بعد كل مرة"},
      {f:'i--',b:"نقّص العداد واحد بعد كل مرة"}
    ]
  },
  { 
    tf: [
      {s:"while تكرر طول ما الشرط صحيح",a:true,why:"أول ما يصير الشرط غلط، توقف."},
      {code:'int n = 5;\nwhile (n > 10) {\n    System.out.println(n);\n}',s:"هالكود يطبع 5",a:false,why:"الشرط غلط من البداية، فما يشتغل ولا مرة."},
      {code:'int x = 1;\nwhile (x <= 3) {\n    System.out.println(x);\n    x = x + 1;\n}',s:"هالكود يطبع 1 ثم 2 ثم 3",a:true,why:"x يزيد كل مرة لين يصير 4 ويوقف."},
      {s:"لو ما غيّرنا شي داخل while، ممكن يكرر للأبد",a:true,why:"الشرط يبقى صحيح دايماً، وهذا اسمه تكرار لا نهائي."},
      {code:'int c = 10;\nwhile (c > 0) {\n    c = c - 5;\n}\nSystem.out.println(c);',s:"هالكود يطبع 0",a:true,why:"10 صار 5 ثم 0، وعندها يوقف."},
      {s:"مع while لازم نعرف عدد مرات التكرار قبل ما نبدأ",a:false,why:"هذي ميزة while: تكرر لين يتحقق شي، حتى لو ما نعرف كم مرة."},
      {code:'int k = 0;\nwhile (k < 2) {\n    System.out.println("Go");\n    k++;\n}',s:"Go تنطبع مرتين",a:true,why:"k يصير 0 ثم 1، وعند 2 يوقف."},
      {code:'int f = 3;\nwhile (f > 0) {\n    f = f - 1;\n}\nSystem.out.println(f);',s:"هالكود يطبع 3",a:false,why:"f نقص لين صار 0، فينطبع 0."}
    ],
    match: [
      {code:'int n = 1;\nwhile (n <= 3) {\n    System.out.println(n);\n    n++;\n}',out:"1 2 3"},
      {code:'int n = 3;\nwhile (n > 0) {\n    System.out.println(n);\n    n--;\n}',out:"3 2 1"},
      {code:'int n = 5;\nwhile (n < 3) {\n    System.out.println(n);\n}',out:"ما ينطبع شي"},
      {code:'int n = 2;\nwhile (n <= 6) {\n    System.out.println(n);\n    n = n + 2;\n}',out:"2 4 6"}
    ],
    bugs: [
      {goal:"1 2 3 ويوقف",lines:['int n = 1;','while (n <= 3) {','    System.out.println(n);','    n = n - 1;','}'],bad:3,fix:'    n = n + 1;',why:"لازم n يزيد عشان يوصل 4 ويوقف. النقصان يخليه يكرر للأبد."},
      {lines:['int t = 5;','while t > 0 {','    t--;','}'],bad:1,fix:'while (t > 0) {',why:"شرط while لازم يكون بين قوسين ( )."},
      {goal:"Beep مرتين",lines:['int b = 0;','while (b < 3) {','    System.out.println("Beep");','    b++;','}'],bad:1,fix:'while (b < 2) {',why:"b يمشي 0 و1 و2، يعني 3 مرات. لازم الشرط b < 2."}
    ],
    cards: [
      {f:'while',b:"طول ما الشرط صحيح، كرر"},
      {f:'تكرار لا نهائي',b:"لما الشرط يبقى صحيح للأبد وما يوقف التكرار"},
      {f:'n++',b:"نفس n = n + 1"},
      {f:'for أو while؟',b:"for لما نعرف عدد المرات، و while لين يصير شي"}
    ]
  },
  { 
    tf: [
      {s:"أول صندوق في المصفوفة رقمه 1",a:false,why:"الترقيم يبدأ من 0."},
      {code:'int[] a = {4, 7, 9};\nSystem.out.println(a[1]);',s:"هالكود يطبع 7",a:true,why:"a[0] = 4، و a[1] = 7."},
      {code:'int[] a = {4, 7, 9};\nSystem.out.println(a.length);',s:"هالكود يطبع 3",a:true,why:"فيها 3 صناديق."},
      {code:'int[] a = {4, 7, 9};\nSystem.out.println(a[3]);',s:"هالكود يطبع 9",a:false,why:"آخر صندوق رقمه 2، و a[3] يعطي خطأ."},
      {code:'String[] c = {"Red", "Blue"};\nSystem.out.println(c[0]);',s:"هالكود يطبع Red",a:true,why:"c[0] أول صندوق."},
      {code:'int[] a = {1, 2, 3};\na[0] = 10;\nSystem.out.println(a[0]);',s:"هالكود يطبع 10",a:true,why:"نقدر نغيّر قيمة أي صندوق في المصفوفة."},
      {s:"آخر صندوق رقمه دايماً length - 1",a:true,why:"لأن العد يبدأ من 0."},
      {code:'int[] a = {5, 5, 5};',s:"هالمصفوفة فيها صندوق واحد",a:false,why:"فيها 3 صناديق، وكلها فيها 5."}
    ],
    match: [
      {code:'int[] a = {3, 6, 9, 12};\nSystem.out.println(a[0]);',out:"3"},
      {code:'int[] a = {3, 6, 9, 12};\nSystem.out.println(a[2]);',out:"9"},
      {code:'int[] a = {3, 6, 9, 12};\nSystem.out.println(a.length);',out:"4"},
      {code:'int[] a = {3, 6, 9, 12};\nSystem.out.println(a[1] + a[3]);',out:"18"}
    ],
    bugs: [
      {lines:['int[] a = {1, 2, 3};','System.out.println(a[3]);'],bad:1,fix:'System.out.println(a[2]);',why:"آخر صندوق رقمه 2، ما فيه صندوق رقمه 3."},
      {lines:['int[] a = (1, 2, 3);','System.out.println(a[0]);'],bad:0,fix:'int[] a = {1, 2, 3};',why:"قيم المصفوفة تنكتب بين أقواس { }."},
      {goal:"Sara",lines:['String[] crew = {"Ali", "Sara"};','System.out.println(crew[2]);'],bad:1,fix:'System.out.println(crew[1]);',why:"Sara رقمها 1 لأن العد يبدأ من 0."}
    ],
    cards: [
      {f:'int[]',b:"مصفوفة أرقام: صف صناديق تحت اسم واحد"},
      {f:'a[0]',b:"أول صندوق"},
      {f:'a.length',b:"عدد الصناديق"},
      {f:'a[a.length - 1]',b:"آخر صندوق"}
    ]
  },
  { 
    tf: [
      {s:"الدالة تشتغل تلقائياً بمجرد ما نكتبها",a:false,why:"الدالة ما تشتغل إلا إذا ناديناها."},
      {code:'static void hi() {\n    System.out.println("Hi");\n}\n\nhi();\nhi();',s:"Hi تنطبع مرتين",a:true,why:"نادينا الدالة مرتين."},
      {s:"void معناها إن الدالة ما ترجّع نتيجة",a:true,why:"تسوي شغل بس، مثل الطباعة."},
      {code:'static int five() {\n    return 5;\n}\n\nSystem.out.println(five());',s:"هالكود يطبع 5",a:true,why:"الدالة ترجّع 5، والطباعة تطبعه."},
      {code:'static int add(int a, int b) {\n    return a + b;\n}\n\nSystem.out.println(add(1, 2));',s:"هالكود يطبع 12",a:false,why:"a و b أرقام مو نصوص، فيطلع 3."},
      {s:"نقدر نرسل قيم للدالة بين القوسين",a:true,why:"مثل add(1, 2)."},
      {code:'static int twice(int x) {\n    return x * 2;\n}\n\nSystem.out.println(twice(twice(2)));',s:"هالكود يطبع 8",a:true,why:"twice(2) = 4، و twice(4) = 8."},
      {s:"return ترجّع قيمة للمكان اللي نادى الدالة",a:true,why:"وعشان كذا نقدر نطبعها أو نحفظها."}
    ],
    match: [
      {code:'static int f(int x) {\n    return x + 1;\n}\n\nSystem.out.println(f(4));',out:"5"},
      {code:'static int f(int x) {\n    return x * x;\n}\n\nSystem.out.println(f(4));',out:"16"},
      {code:'static int f(int x) {\n    return x - 1;\n}\n\nSystem.out.println(f(4));',out:"3"},
      {code:'static void g() {\n    System.out.println("Run");\n}\n\ng();',out:"Run"}
    ],
    bugs: [
      {lines:['static void hello() {','    System.out.println("Hello");','}','hello;'],bad:3,fix:'hello();',why:"مناداة الدالة تحتاج قوسين ()."},
      {lines:['static int add(int a, int b) {','    a + b;','}'],bad:1,fix:'    return a + b;',why:"الدالة نوعها int، فلازم ترجّع النتيجة بـ return."},
      {goal:"9",lines:['static int square(int n) {','    return n * 2;','}','System.out.println(square(3));'],bad:1,fix:'    return n * n;',why:"التربيع هو الرقم ضرب نفسه: n * n."}
    ],
    cards: [
      {f:'void',b:"الدالة ما ترجّع نتيجة"},
      {f:'return',b:"ترجّع النتيجة للمكان اللي نادى الدالة"},
      {f:'hello();',b:"مناداة الدالة وتشغيلها"},
      {f:'(int x)',b:"قيمة تستقبلها الدالة وقت المناداة"}
    ]
  }
];
