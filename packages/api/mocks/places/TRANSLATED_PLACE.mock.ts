import { CountryCodes, SupportedLanguagesCode } from "@soliguide/common";
import { ApiTranslatedPlace } from "../../src/translations/interfaces";
import { ObjectId } from "mongodb";

export const TRANSLATED_PLACE: ApiTranslatedPlace = {
  placeObjectId: new ObjectId(),
  createdAt: new Date("2021-10-09T21:01:43.887Z"),
  sourceLanguage: SupportedLanguagesCode.FR,
  languages: {
    ar: {
      place: {
        description:
          "يهدف مركز الاستقبال هذا المخصص للنساء في حالة استبعاد كبير جدًا إلى تلبية احتياجاتهن الأساسية من خلال تقديم دش وغسيل الملابس ومنطقة للراحة والوجبات الخفيفة و SIAO U<p style='text-align:right;direction:rtl;'></p><p style='text-align:right;direction:rtl;'> بدء و / أو تنفيذ متابعة اجتماعية تربوية ، وشبكات للتوجيه تتكيف مع احتياجات الناس ، والاستمرار النفسي والطبي</p><p style='text-align:right;direction:rtl;'> الشروع في عملية إعادة بناء الشخصية من خلال ورش العمل والأنشطة الثقافية وما إلى ذلك.</p><p style='text-align:right;direction:rtl;'></p><p style=text-align:right;direction:rtl;'> عن طريق التعيين في فترة ما بعد الظهر. مفتوح في أيام العطل الرسمية من 9 صباحًا حتى 4 مساءً (ساعات الأحد).</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [],
        tempInfos: {
          closure: {
            description:
              "الانتقال مؤقتًا إلى Carreau du Temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    ca: {
      place: {
        description:
          "Aquest centre d'acollida dedicat a dones en molt gran exclusió té com a objectiu cobrir les seves necessitats bàsiques oferint dutxa, bugaderia, zona de descans, berenars, SIAO U<p></p><p> Iniciar i/o realitzar un seguiment socioeducatiu. up, networking per a l'orientació adaptada a les necessitats de les persones, permanència psicològica i mèdica</p><p> Iniciar el procés de reconstrucció personal mitjançant tallers, accions culturals, etc.</p><p></p><p> A la tarda amb cita prèvia. Obert els festius de 9 a 16 h (horari de diumenge)</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [{ description: "Servei de traducció d'anglès" }],
        tempInfos: {
          closure: {
            description:
              "Trasllat temporal al Carreau du temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    en: {
      place: {
        description:
          "This reception center dedicated to women in very great exclusion aims to meet their basic needs by offering shower, laundry, rest area, snacks, SIAO U<p></p><p> Initiate and / or carry out socio-educational follow-up, networking for orientation adapted to the needs of people, psychological and medical permanence</p><p> Initiate the process of personal reconstruction through workshops, cultural actions etc.</p><p></p><p> By appointment in the afternoon. Open on public holidays from 9 a.m. to 4 p.m. (Sunday hours).</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [{ description: "English service Translate" }],
        tempInfos: {
          closure: {
            description:
              "Temporary move to the Carreau du temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    es: {
      place: {
        description:
          "Este centro de acogida dedicado a mujeres en muy gran exclusión tiene como objetivo satisfacer sus necesidades básicas ofreciendo ducha, lavandería, zona de descanso, snacks, SIAO U<p></p><p> Iniciar y / o realizar seguimiento socioeducativo, networking para orientación adaptada a las necesidades de las personas, permanencia psicológica y médica</p><p> Iniciar el proceso de reconstrucción personal a través de talleres, acciones culturales, etc.</p><p></p><p> Con cita previa por la tarde. Abierto los días festivos de 9 a 16 h (horario de domingo).</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [],
        tempInfos: {
          closure: {
            description:
              "Traslado temporal al Carreau du temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    fa: {
      place: {
        description:
          "این مرکز پذیرایی که به زنان بسیار محروم اختصاص داده شده است ، با ارائه دوش ، لباسشویی ، محل استراحت ، میان وعده ، SIAO U <p style='text-align:right;direction:rtl;'></p><p style='text-align:right;direction:rtl;'> شروع و / یا پیگیری آموزشی-اجتماعی نیازهای اصلی آنها را برآورده می کند. بالا ، ایجاد شبکه جهت جهت گیری متناسب با نیازهای افراد ، ماندگاری روانی و پزشکی </p><p style='text-align:right;direction:rtl;'> آغاز فرآیند بازسازی شخصی از طریق کارگاه ها ، اقدامات فرهنگی و غیره. با قرار بعدازظهر. در روزهای تعطیل رسمی از ساعت 9 صبح تا 4 بعد از ظهر باز است. (ساعات یکشنبه). </p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [],
        tempInfos: {
          closure: {
            description:
              "حرکت موقت به Carreau du Temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    ka: {
      place: {
        description:
          "ეს მიმღები ცენტრი, რომელიც ეძღვნება ძალიან დიდ გარიყულ ქალებს, მიზნად ისახავს დააკმაყოფილოს მათი ძირითადი საჭიროებები შხაპის, სამრეცხაოების, დასასვენებელი ადგილის, საჭმლის, SIAO U<p></p><p> ინიცირება და/ან განახორციელოს სოციალურ-საგანმანათლებლო შემდგომი ზევით, ხალხის საჭიროებებზე ადაპტირებული ორიენტაციისთვის, ფსიქოლოგიური და სამედიცინო მუდმივობა</p><p> პერსონალური რეკონსტრუქციის პროცესის ინიცირება ვორქშოფების, კულტურული აქციების და ა.შ.</p><p></p><p> შუადღისას დანიშვნით. ღიაა სახალხო დღესასწაულებზე დილის 9 საათიდან საღამოს 4 საათამდე. (კვირა საათები).</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [{ description: "ინგლისური მთარგმნელობითი სერვისი" }],
        tempInfos: {
          closure: {
            description:
              "დროებითი გადარიცხვა Carreau du temple-ში: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    ps: {
      place: {
        description:
          "دا د استقبال مرکز چې په خورا عالي استثنا کې میرمنو ته وقف شوی هدف یې د شاور ، کالو مینځلو ، استراحت ځای ، نانځکو ، SIAO U <p style='text-align:right;direction:rtl;'></p><p style='text-align:right;direction:rtl;'> له لارې د دوی لومړني اړتیاوې پوره کول دي. پورته ، د خلکو اړتیاو ، رواني او طبي استحکام سره سمون موندنې لپاره شبکه کول </p><p style='text-align:right;direction:rtl;'> د ورکشاپونو ، کلتوري کړنو او نورو له لارې د شخصي بیارغونې پروسه پیل کړئ </p><p style='text-align:right;direction:rtl;'></p><p style='text-align:right;direction:rtl;'> په ماسپښین کې د ملاقات په واسطه. په عامه رخصتیو کې د سهار له 9 بجو څخه تر 4 بجو پورې خلاص وي (د یکشنبې ساعتونه). </p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [],
        tempInfos: {
          closure: {
            description:
              "لنډمهاله حرکت ته Carreau du temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    ro: {
      place: {
        description:
          "Acest centru de primire dedicat femeilor aflate în foarte mare excludere își propune să le satisfacă nevoile de bază prin oferirea de duș, spălătorie, zonă de odihnă, gustări, SIAO U<p></p><p> Inițierea și/sau efectuarea urmăririi socio-educative. up, networking pentru orientare adaptată nevoilor oamenilor, permanență psihologică și medicală</p><p> Inițierea procesului de reconstrucție personală prin ateliere, acțiuni culturale etc.</p><p></p><p> Dupa-amiaza dupa programare. Deschis de sărbătorile legale de la 9:00 la 16:00. (orele de duminică).</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [],
        tempInfos: {
          closure: {
            description:
              "Mutare temporară la Carreau du temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    ru: {
      place: {
        description:
          "Этот центр приема, посвященный женщинам, находящимся в очень большой изоляции, призван удовлетворить их основные потребности, предлагая душ, прачечную, зону отдыха, закуски, SIAO U<p></p><p> Инициировать и / или проводить социально-педагогическое наблюдение, сетевое взаимодействие для ориентации, адаптированной к потребностям людей, психологической и медицинской устойчивости</p><p> Инициируйте процесс восстановления личности с помощью семинаров, культурных мероприятий и т. Д.</p><p></p><p> По предварительной записи днем. Открыт в праздничные дни с 9:00 до 16:00 (в воскресенье).</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [],
        tempInfos: {
          closure: {
            description:
              "Временный переезд в Carreau du Temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
    uk: {
      place: {
        description:
          "Этот центр приема, посвященный женщинам, находящимся в очень большой изоляции, призван удовлетворить их основные потребности, предлагая душ, прачечную, зону отдыха, закуски, SIAO U<p></p><p> Инициировать и / или проводить социально-педагогическое наблюдение, сетевое взаимодействие для ориентации, адаптированной к потребностям людей, психологической и медицинской устойчивости</p><p> Инициируйте процесс восстановления личности с помощью семинаров, культурных мероприятий и т. Д.</p><p></p><p> По предварительной записи днем. Открыт в праздничные дни с 9:00 до 16:00 (в воскресенье).</p>",
        modalities: {
          appointment: {
            precisions: null,
          },
          inscription: {
            precisions: null,
          },
          orientation: {
            precisions: null,
          },
          other: null,
          price: {
            precisions: null,
          },
        },
        publics: {
          description: null,
        },
        services_all: [],
        tempInfos: {
          closure: {
            description:
              "Временный переезд в Carreau du Temple: https://soliguide.fr/fr/fiche/8062",
          },
          hours: {
            description: null,
          },
          message: {
            description: null,
            name: null,
          },
        },
      },
      translationRate: 0,
    },
  },
  lastUpdate: new Date("2021-10-10T09:00:01.012Z"),
  lieu_id: 18,
  translationRate: 0,
  updatedAt: new Date("2021-10-10T09:00:01.019Z"),
  position: {
    country: CountryCodes.FR,
    regionCode: "75",
    departmentCode: "75",
  },
  place: {
    name: "Antenne Marcel Paul - Secours Populaire Français",
    lieu_id: 33,
    seo_url: "antenne-marcel-paul-paris-33",
  },
};
