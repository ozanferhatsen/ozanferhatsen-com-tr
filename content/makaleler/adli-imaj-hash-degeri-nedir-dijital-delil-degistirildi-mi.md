---
title: "Adli İmaj ve Hash Değeri Nedir? Dijital Delilin Değiştirilmediği Nasıl Anlaşılır?"
slug: "adli-imaj-hash-degeri-nedir-dijital-delil-degistirildi-mi"
date: "2026-09-08T22:05:00+03:00"
updated: "2026-09-08T22:05:00+03:00"
category: "Bilişim Hukuku"
category_url: "/bilisim-hukuku/"
keyword: "Adli İmaj ve Hash"
summary: "Dijital delilde yalnız ne bulunduğu değil, hangi verinin hangi yöntemle kopyalandığı ve inceleme boyunca aynı kaldığının nasıl denetlendiği de önemlidir. Adli imaj ve hash değerleri bu denetlenebilirliğin teknik omurgasını oluşturur."
seo_title: "Adli İmaj ve Hash Değeri Nedir? Dijital Delil Bütünlüğü"
description: "Adli imaj ve hash değeri nedir? Telefon ve bilgisayar incelemesinde bit düzeyinde kopya, veri bütünlüğü, hash eşleşmesi ve dijital delilin değiştirilip değiştirilmediği."
series_id: "ncmec-dijital-delil"
series_order: 9
sources:
  - name: "Murat Volkan Dülger, Bilişim Suçları ve İnternet İletişim Hukuku, 11. Baskı, 2025."
  - name: "İsmail Akkaya, Bilgisayarlarda, Bilgisayar Programlarında ve Kütüklerinde Arama, Kopyalama ve Elkoyma (CMK m. 134), 1. Baskı, 2024."
  - name: "5271 sayılı Ceza Muhakemesi Kanunu, m. 134 ve m. 217."
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5271.pdf"
---

## Kısa cevap: Adli imaj ve hash neden önemlidir?

**Dijital delilde yalnızca dosyanın içeriği değil, o dosyanın hangi kaynaktan alındığı ve inceleme boyunca değişmeden kaldığının gösterilebilmesi de önemlidir.** Adli imaj, dijital veri kaynağının inceleme için oluşturulan adli kopyasını; hash değeri ise belirli bir veri kümesinin teknik olarak karşılaştırılmasına yarayan özet değerini ifade eder.

Bir telefon, bilgisayar, disk veya başka bir dijital veri kaynağında suçla ilişkili görünen bir dosya bulunması ilk bakışta güçlü bir tespit olabilir. Fakat ceza dosyasında ikinci bir soru hemen doğar:

**İncelenen veri, cihazdan alınan veriyle gerçekten aynı veri midir?**

Serinin [önceki bölümünde hukuka aykırı dijital delil ile teknik güvenilirlik arasındaki farkı](/makaleler/hukuka-aykiri-dijital-delil-telefon-bilgisayar-incelemesi/) ele aldık. Adli imaj ve hash, bu ayrımın teknik tarafını görünür hâle getirir.

## Adli imaj nedir?

Gündelik dilde “kopya almak” ile adli bilişimde kullanılan “imaj almak” aynı şey değildir.

Bir klasörü USB belleğe sürükleyerek kopyalamak, yalnız görünen dosyaların bir örneğini oluşturabilir. Adli imaj ise kullanılan yönteme göre veri kaynağının çok daha kapsamlı bir kopyasını oluşturmayı amaçlar. Özellikle disk incelemelerinde bit düzeyinde imaj, yalnız aktif dosyaları değil, dosya sistemi yapısını, ayrılmamış alanları ve silinmiş verilerin izlerini de içerebilecek şekilde veri kaynağını temsil edebilir.

Murat Volkan Dülger ve İsmail Akkaya'nın çalışmalarında dijital incelemenin mümkün olduğunca orijinal veri üzerinde değişiklik yaratmadan, uygun adli kopya üzerinden yürütülmesinin önemi vurgulanmaktadır.

Buradaki temel amaç basittir:

**Orijinal cihazı mümkün olduğunca korumak, incelemeyi kopya üzerinde yapmak ve sonradan aynı verinin incelendiğini denetlenebilir hâle getirmek.**

## Her kopya adli imaj mıdır?

Hayır.

Bir cihazdan yalnız belirli fotoğrafların, mesajların veya klasörlerin dışarı aktarılması da kopyalama işlemidir; fakat bu işlem her zaman tam adli imaj anlamına gelmez.

Uygulamada farklı veri alma yöntemleri kullanılabilir:

- belirli dosyaların seçilerek kopyalanması,
- mantıksal veri çıkarımı,
- dosya sistemi düzeyinde veri alma,
- fiziksel veya bit düzeyinde imaj alma,
- mobil cihazlarda kullanılan araca ve cihazın güvenlik yapısına göre daha sınırlı veri çıkarımları.

Bu yöntemlerin her biri aynı miktarda veriyi sağlamaz. Bu nedenle bilirkişi raporunda yalnız “cihazın imajı alındı” yazılması yerine **hangi yöntemle, hangi veri kaynağından ve hangi kapsamda veri alındığının anlaşılabilmesi** önemlidir.

Özellikle silinmiş dosya, uygulama verisi veya geçmiş işlem izi tartışılıyorsa veri alma yönteminin kapsamı doğrudan sonucun güvenilirliğini etkileyebilir.

## Hash değeri nedir?

Hash, belirli dijital veriden matematiksel bir işlemle üretilen teknik özet değerdir. Uygun şekilde kullanıldığında iki veri kümesinin aynı olup olmadığının kontrol edilmesine yardımcı olur.

Örneğin bir disk imajı alınırken hash değeri hesaplanabilir. Daha sonra inceleme için kullanılan kopyanın hash değeri tekrar hesaplandığında aynı sonucun elde edilmesi, kopyanın karşılaştırılan aşamalar arasında aynı kaldığını göstermede güçlü bir teknik kontroldür.

Benzer şekilde NCMEC veya platform kayıtlarında belirli bir görsel ya da videoya ilişkin hash değeri bulunuyorsa, cihazdaki dosyanın aynı materyal olup olmadığının teknik karşılaştırılmasında hash kullanılabilir.

Ancak burada iki farklı kullanım birbirine karıştırılmamalıdır:

1. **Veri bütünlüğü için hash:** İnceleme kopyasının aynı kaldığını kontrol eder.
2. **Dosya eşleştirmesi için hash:** İki dosyanın aynı veri içeriğine sahip olup olmadığını karşılaştırmaya yardımcı olur.

Aynı teknik araç, ceza dosyasında iki ayrı soruya cevap verebilir.

## Hash değeri dosyayı kimin kullandığını gösterir mi?

Hayır.

Hash değeri dosyanın veya veri kümesinin kimliği ve bütünlüğü hakkında teknik bilgi verir; **faili göstermez.**

Bir görüntünün NCMEC raporundaki dosyayla aynı hash değerine sahip olması, dosya eşleşmesini çok güçlü biçimde ortaya koyabilir. Fakat bu veri tek başına;

- dosyayı kimin indirdiğini,
- kimin açtığını,
- kimin bilinçli biçimde sakladığını,
- kimin paylaştığını

göstermez.

Bu nedenle serinin ilk bölümlerinde yaptığımız ayrım burada da geçerlidir: **dosyanın kimliği ile failin kimliği aynı mesele değildir.** Fail bağlantısı; kullanıcı hesabı, cihaz kullanımı, zaman verileri, dosyanın bulunduğu konum ve diğer dijital izlerle ayrıca değerlendirilir.

## Hash eşleşmesi dijital delilin hiç değiştirilmediğini kesin olarak ispatlar mı?

Hash eşleşmesi veri bütünlüğü bakımından son derece güçlü bir teknik göstergedir. Ancak hukuki değerlendirme yalnız tek bir hash satırından ibaret değildir.

Önce hangi verinin hash'inin alındığı bilinmelidir. Orijinal cihazın tamamı mı, oluşturulan imaj dosyası mı, belirli bir klasör mü, tek bir görsel mi?

Ayrıca hash değerinin;

- hangi aşamada üretildiği,
- tutanağa veya rapora geçirilip geçirilmediği,
- inceleme öncesi ve sonrası karşılaştırmanın yapılıp yapılmadığı,
- hangi kopya üzerinde çalışıldığı

anlaşılabilmelidir.

Bu nedenle “raporda bir hash değeri var” ile “delil zinciri baştan sona denetlenebilir” aynı şey değildir. Hash, zincirin önemli halkalarından biridir; fakat hangi veriyle ilişkilendirildiği açık olmalıdır.

## Hash yoksa dijital delil otomatik olarak geçersiz midir?

Hayır. Bu konuda mekanik bir kural kurmak doğru değildir.

Hash kaydının bulunmaması özellikle veri bütünlüğünün nasıl korunduğu konusunda önemli bir eksiklik yaratabilir. Fakat bu eksikliğin hukuki sonucu somut dosyadaki diğer kayıtlarla birlikte değerlendirilir.

Örneğin;

- veri hangi yöntemle alınmış,
- orijinal cihaz muhafaza edilmiş mi,
- işlemler tutanağa bağlanmış mı,
- kullanılan adli bilişim aracı kayıt üretmiş mi,
- hangi kopya üzerinde inceleme yapıldığı belli mi,
- veri bütünlüğü başka teknik kayıtlarla denetlenebiliyor mu

soruları önem kazanır.

Dolayısıyla hash eksikliği çoğu zaman **dijital delilin güvenilirliği ve denetlenebilirliği** üzerinde tartışma yaratır. Bunun doğrudan hukuka aykırı delil sonucuna dönüşüp dönüşmeyeceği ise [hukuka aykırı dijital delil hakkındaki önceki bölümde](/makaleler/hukuka-aykiri-dijital-delil-telefon-bilgisayar-incelemesi/) ele aldığımız ayrı hukuki değerlendirmeyi gerektirir.

## Orijinal cihaz üzerinde doğrudan çalışmak neden sorun yaratabilir?

Dijital cihazlar çalıştırıldıkları anda bile veri üretebilir ve değiştirebilir. İşletim sistemi günlükleri güncellenebilir, uygulamalar senkronizasyon yapabilir, dosya erişim zamanları değişebilir veya arka planda yeni kayıtlar oluşabilir.

Bu nedenle adli bilişim metodolojisinde mümkün olduğunca orijinal veri kaynağını korumak ve incelemeyi uygun kopya üzerinde yürütmek önem taşır.

Bu yaklaşım iki nedenle değerlidir:

Birincisi, delilin inceleme sırasında değiştirildiği iddiasını azaltır. İkincisi, başka bir uzmanın aynı veri kümesini sonradan yeniden inceleyebilmesini sağlar.

Dijital delilin güvenilirliği yalnız “bilirkişi bunu buldu” cümlesinden değil, **başka bir uzmanın aynı veriden aynı sonuca ulaşabilme imkânından** da güç kazanır.

## Write blocker ve veri koruma yöntemleri neden kullanılır?

Bilgisayar diskleri gibi bazı veri kaynaklarında inceleme sırasında orijinal ortama yazma yapılmasını önlemek amacıyla teknik koruma yöntemleri kullanılabilir. Yazma engelleyici araçlar, adli bilişim sürecinde veri kaynağının değişmeden korunmasına yardımcı olur.

Her mobil cihaz veya veri kaynağında aynı teknik yöntem uygulanamayabilir. Bu nedenle asıl hukuki soru belirli bir aracın adından çok şudur:

**İnceleme sırasında orijinal verinin değişmesini önlemek ve yapılan işlemleri sonradan denetlemek için hangi yöntem kullanıldı?**

Bilirkişi raporunun bu soruya cevap verebilmesi, kullanılan yöntemin güvenilirliğini değerlendirilebilir hâle getirir.

## Adli imaj alınırken tutanakta neler bulunması önemlidir?

Somut olayın niteliğine göre değişmekle birlikte, sağlıklı bir veri alma zincirinde şu bilgiler özellikle anlamlıdır:

- incelenen cihazın veya veri kaynağının tanımı,
- marka, model, seri numarası veya ayırt edici bilgiler,
- veri alma tarihi ve saati,
- kullanılan yazılım veya donanım,
- veri alma yönteminin türü,
- oluşturulan imaj veya kopyanın tanımı,
- hesaplanan hash değerleri,
- imajın saklandığı ortam,
- işlemi yapan kişiler,
- varsa işlem sırasında karşılaşılan teknik sınırlamalar.

Bunların amacı raporu teknik terimlerle şişirmek değildir. Amaç, delilin **nereden geldiğini ve hangi aşamalardan geçtiğini izlenebilir hâle getirmektir.**

## NCMEC dosyasında hash neden iki kat önemlidir?

NCMEC/CyberTipline dosyalarında iki ayrı hash karşılaştırması gündeme gelebilir.

İlki, NCMEC veya platform tarafından bildirilen dosyanın cihazda bulunan dosyayla aynı olup olmadığıdır. Serinin [NCMEC raporunun delil değeri hakkındaki bölümünde](/makaleler/ncmec-raporu-tek-basina-mahkumiyet-yeterli-mi/) ele aldığımız Yargıtay yaklaşımında da rapordaki görüntü ile hard diskte bulunan görüntünün aynı olup olmadığının bilirkişi incelemesiyle belirlenmesi önem taşır.

İkincisi, cihazdan alınan adli kopyanın inceleme boyunca aynı kaldığının gösterilmesidir.

Bu nedenle tek dosyada hem **materyal eşleşmesi** hem de **delil bütünlüğü** bakımından hash verisi önem kazanabilir.

## Bilirkişi raporunda yalnız “hash değeri aynı” denmesi yeterli midir?

Her zaman değil. Karşılaştırmanın neye ilişkin olduğu açık olmalıdır.

Raporda;

- hangi iki veri kümesinin karşılaştırıldığı,
- hangi hash algoritmasının kullanıldığı,
- değerlerin hangi aşamada üretildiği,
- karşılaştırmanın dosya eşleşmesine mi yoksa imaj bütünlüğüne mi ilişkin olduğu

anlaşılabilmelidir.

Aksi hâlde teknik olarak doğru görünen tek cümle hukuken neyin ispatlandığını açıklamayabilir.

Bu nokta serinin ilerleyen bölümünde ele alınacak [adli bilişim bilirkişi raporuna itiraz](/makaleler/adli-bilisim-bilirkisi-raporuna-itiraz-hash-imaj-delil-butunlugu/) bakımından özellikle önemlidir. Etkili itiraz, “hash yok” demekten çok, **hangi verinin bütünlüğünün neden denetlenemediğini** göstermelidir.

## Adli imaj ile cihazın fiziksel olarak elde tutulması aynı şey midir?

Hayır.

Adli imaj veri incelemesinin teknik aracıdır; cihazın kolluk veya adli makamlar tarafından fiziksel olarak muhafaza edilmesi ise koruma tedbiriyle ilgilidir.

Gerekli veri kopyası alınmış ve teknik inceleme uygun kopya üzerinde sürdürülebiliyorsa, cihazın neden hâlâ elde tutulduğu ayrı bir hukuki soruya dönüşebilir.

Bu nedenle serinin [bir sonraki bölümünde bilgisayar veya telefona ne zaman el konulabileceğini ve gerekli imaj/kopya alındıktan sonra cihazın ne zaman iade edilmesi gerektiğini](/makaleler/bilgisayar-telefon-el-koyma-imaj-sonrasi-cihaz-iadesi/) ele alıyoruz.

<div class="cyber-note"><strong>Adli imaj “delilin bir kopyası”, hash ise yalnızca “bir numara” değildir.</strong><br>İkisi birlikte doğru kullanıldığında, hangi verinin cihazdan alındığını, hangi kopyanın incelendiğini ve inceleme boyunca aynı veri üzerinde çalışılıp çalışılmadığını denetlenebilir hâle getirir.</div>

## Sonuç

Dijital delilde güvenilirlik, yalnız dosyanın ekranda görünmesiyle kurulmaz. Delilin hangi veri kaynağından alındığı, orijinal verinin nasıl korunduğu, hangi kopya üzerinde çalışıldığı ve inceleme sırasında verinin aynı kaldığının nasıl gösterildiği önemlidir.

Adli imaj bu zincirin kopyalama tarafını, hash değeri ise bütünlük ve eşleştirme tarafını güçlendirir.

Bu nedenle bir dijital inceleme raporunda doğru soru yalnız **“dosya bulundu mu?”** değildir.

Aynı zamanda şu sorunun da cevabı görülebilmelidir:

**Bulunan dosyanın ve incelenen veri kümesinin, cihazdan elde edilen veriyle aynı olduğu hangi teknik yöntemle doğrulandı?**
