# Лаборатори №1 — UI автомат тест (Playwright)

**Хичээл:** F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест (2026)
**Хэрэгсэл:** [Playwright](https://playwright.dev) + TypeScript
**Тестлэсэн сайт:** [https://www.saucedemo.com](https://www.saucedemo.com) — тест хийх зориулалттай нээлттэй демо дэлгүүр

---

## Юу хийсэн бэ

Playwright төслийг үүсгэж тохируулаад, saucedemo дэлгүүрийн нэвтрэх урсгал болон нэвтэрсний
дараах үйлдлүүдийг автоматжуулсан **5 тест** бичсэн. Тест бүр өөрөө нэвтэрч, өөрөө гардаг тул
дарааллаас үл хамааран дангаараа ажиллана (test isolation).

| # | Тест | Файл | Юу шалгаж байгаа |
|---|------|------|------------------|
| 1 | Амжилттай нэвтрэх | `tests/login.spec.ts` | `/inventory.html` руу шилжсэн, "Products" гарчиг харагдсан, 6 бараа ачаалагдсан |
| 2 | Амжилтгүй нэвтрэх — буруу нууц үг | `tests/login.spec.ts` | Алдааны мессеж гарсан, хуудас солигдоогүй (сөрөг тест) |
| 3 | Амжилтгүй нэвтрэх — түгжигдсэн хэрэглэгч | `tests/login.spec.ts` | `locked_out_user` зөв нууц үгтэй ч оруулахгүй байгаа |
| 4 | Бараа сагслах | `tests/inventory.spec.ts` | Товч "Remove" болж хувирсан, сагсны тоолуур 1 болсон, сагсанд яг тэр бараа орсон |
| 5 | Барааг үнээр эрэмбэлэх | `tests/inventory.spec.ts` | "Price (low to high)" сонгоход үнэ үнэхээр өсөх дарааллаар байгаа |

Давтагдах `login` / `logout` үйлдлийг `tests/helpers.ts` дотор төвлөрүүлсэн — локатор
өөрчлөгдвөл нэг газраас засахад хангалттай.

## Ажиллуулах

```bash
npm install               # хамааралтай сангуудыг татах
npx playwright install    # хөтөчүүдийг суулгах (эхний удаад)

npx playwright test       # бүх тестийг ажиллуулах
npx playwright show-report  # HTML тайланг нээх
```

Тодорхой нэг тест: `npx playwright test tests/login.spec.ts`
Хөтөч харагдуулж ажиллуулах: `npx playwright test --headed`

## Үр дүн

```
Running 5 tests using 5 workers
  5 passed (6.2s)
```

- **HTML тайлан:** [`playwright-report/index.html`](playwright-report/index.html) — репод хадгалсан.
  Хуулж аваад `npx playwright show-report` эсвэл шууд браузераар нээж үзнэ.
- **Trace:** `playwright.config.ts` дотор `trace: 'on'` тохируулсан тул тест бүрийн алхам алхмын
  бичлэг, DOM snapshot, network лог нь тайлангийн дотор хадгалагдсан байгаа.
  Тусад нь: `npx playwright show-trace test-results/.../trace.zip`
- **Видео:** `video: 'retain-on-failure'` — унасан тестийн видео л хадгалагдана
  (амжилттай тестийн видео нь зөвхөн зай эзэлдэг тул).

## Codegen ба Trace viewer

### Codegen

```bash
npx playwright codegen saucedemo.com
```

Хөтөч дээр гараар хийсэн үйлдлийг шууд код болгож бичүүлж болно. Гарсан кодыг өөрийн бичсэнтэй
харьцуулахад:

- Codegen нь локаторыг заримдаа хэт нарийн (`#user-name` гэх мэт id) сонгодог;
- Ямар ч **assertion** бичдэггүй — зөвхөн үйлдлийг л бүртгэдэг, өөрөөр хэлбэл "тест" биш "бичлэг";
- Давтагдах кодыг функц болгож ялгадаггүй (бидний `helpers.ts` шиг).

Тиймээс codegen-ийг бэлэн тест гэж авахгүй, локатор олох, хуудасны бүтэцтэй танилцах туслах
хэрэгсэл болгож ашиглаад, assertion болон бүтцийг нь өөрөө бичих нь зөв.

### Trace viewer — зориудаар унагаж туршсан нь

Assertion-оо зориудаар буруу болгож (`toHaveText('Products')` -> `toHaveText('Products1')`) тест
унагаад trace-ийг нь хадгалсан:

```bash
npx playwright show-trace docs/failed-test-trace.zip
```

| Файл | Тайлбар |
|------|---------|
| [`docs/failed-test-trace.zip`](docs/failed-test-trace.zip) | Унасан тестийн бүрэн trace (timeline, DOM snapshot, network, console) |
| [`docs/failed-test-video.webm`](docs/failed-test-video.webm) | Тест ажиллаж буй видео бичлэг |
| [`docs/failed-test-screenshot.png`](docs/failed-test-screenshot.png) | Унасан агшны скриншот |

Trace viewer дээр зүүн талд алхмуудын timeline, дунд нь тухайн агшны хуудасны бодит snapshot,
баруун талд network болон console лог харагддаг. Алдааны мессеж нь "expected `Products1`,
received `Products`" гэж яг ямар утга ирснийг шууд хэлж өгсөн. Selenium дээр бол лог, скриншот
харж таамаглах шаардлагатай болдог байсан.

## Яагаад XPath-аас зайлсхийсэн бэ

Тестүүд дээр `getByRole`, `getByPlaceholder`, `getByText`, `getByTestId` зэрэг орчин үеийн
локаторуудыг ашигласан. XPath (`//div[3]/form/input[2]` гэх мэт) нь **DOM-ын бүтцээс** хамаардаг
тул дизайнер нэг `<div>` нэмэхэд л тест унадаг — гэтэл програм өөрөө огт эвдрээгүй байдаг.
Ийм "хуурамч уналт" (false failure) нь тестийн итгэлцлийг устгадаг.

Харин `getByRole('button', { name: 'Login' })` нь хэрэглэгчийн **нүдээр харж, дэлгэцийн уншигчаар
сонсож** байгаа шинжид тулгуурладаг: товч байрлалаа сольсон ч, HTML-ээ өөрчилсөн ч, "Login"
нэртэй товч байсаар л байвал тест дамжина. Нэмээд энэ нь **accessibility**-г шууд шалгаж өгдөг —
role, name зөв тавигдаагүй бол тест олохгүй тул алдаа нь эрт илэрнэ. saucedemo нь `data-testid`
биш `data-test` атрибут хэрэглэдэг тул `playwright.config.ts` дотор `testIdAttribute: 'data-test'`
гэж тохируулсан.

## Playwright ба Selenium — өөрийн ажиглалт

1. Хамгийн том ялгаа нь **auto-wait**: Playwright элемент харагдаж, идэвхтэй болтол өөрөө хүлээдэг
   тул Selenium дээр байнга бичдэг байсан `WebDriverWait`, `ExpectedConditions`-ийн код бүхэлдээ
   алга болсон.
2. Улмаар `Thread.sleep()` гэх мэт "гараар хүлээх" муу дадал үүсэх шалтгаангүй болж, тестийн
   flaky байдал эрс буурдаг.
3. **Суулгалт**: Selenium дээр хөтөч бүрд тохирох driver-ийг (chromedriver, geckodriver) хувилбарт
   нь тааруулж суулгах шаардлагатай байсан бол Playwright `npx playwright install` гэсэн нэг
   командаар хөтөчүүдийг өөрөө татаж, хувилбарын зөрчлийг үндсээр нь арилгасан.
4. **Дебаг хийх туршлага**: Selenium дээр лог, скриншот харж таамаглах байсан бол Playwright-ийн
   **trace viewer** нь алхам бүрийн DOM snapshot, network, console-ыг цуг хадгалдаг тул алдаа
   мөшгих хугацаа хэд дахин богиносдог.
5. **Локатор**: Selenium-д XPath/CSS давамгайлдаг байсан бол Playwright нь `getByRole`,
   `getByLabel` зэрэг хэрэглэгчийн өнцгөөс харсан локаторыг стандарт болгосон нь тестийг
   уншихад ойлгомжтой, эвдрэхэд тэсвэртэй болгож байна.
6. **Хурд**: 5 тест зэрэг (parallel) ажиллаад 6 секундэд дуусч байна. Playwright нь browser
   context-ээр тусгаарладаг тул шинэ хөтөч бүтэн ачаалахгүй, харин Selenium дээр session бүрд
   хөтөч дахин нээгддэг тул удаан байдаг.
7. **Дутагдал талаас нь** харвал: Selenium нь W3C WebDriver стандарт дээр суурилдаг, Java/C#
   зэрэг хэлний экосистем, олон жилийн материал, Selenium Grid зэрэг нь илүү боловсронгуй.
   Хуучин, том хэмжээний enterprise систем дээр Selenium-ийн дэмжлэг өргөн хэвээр байна.
8. Лицензийн хувьд аль аль нь **Apache 2.0**, бүрэн үнэгүй, нээлттэй эх — тул сонголт нь
   зардлаас бус зөвхөн техникийн давуу талаас хамаарч байна. Шинээр эхэлж буй төсөлд би
   Playwright-ийг сонгоно.

## Төслийн бүтэц

```
lab01/
├── tests/
│   ├── helpers.ts          # login/logout туслах функцууд
│   ├── login.spec.ts       # нэвтрэх урсгалын 3 тест
│   └── inventory.spec.ts   # нэвтэрсний дараах 2 тест
├── playwright-report/      # HTML тайлан + trace (зориудаар git-д хадгалсан)
├── docs/                   # зориудаар унагасан тестийн trace, видео, скриншот
├── playwright.config.ts    # baseURL, trace, video, testIdAttribute тохиргоо
├── .gitignore
└── README.md
```
