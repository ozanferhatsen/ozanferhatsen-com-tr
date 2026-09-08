---
title: "Silinmiş Dosya ve Mesajlar Ceza Davasında Dijital Delil Olabilir mi?"
slug: "silinmis-dosya-mesajlar-dijital-delil-ceza-davasi"
date: "2026-09-08T22:08:00+03:00"
updated: "2026-09-08T22:08:00+03:00"
category: "Bilişim Hukuku"
category_url: "/bilisim-hukuku/"
keyword: "Silinmiş Dijital Delil"
summary: "Silinmiş bir dosya veya mesajın teknik olarak kurtarılabilmesi, onun hukuki anlamını tek başına belirlemez. Verinin nereden kurtarıldığı, tam mı parçalı mı olduğu, zaman bilgileri ve kullanıcıyla nasıl ilişkilendirildiği birlikte değerlendirilmelidir."
seo_title: "Silinmiş Dosya ve Mesajlar Dijital Delil Olabilir mi?"
description: "Silinmiş dosya ve mesajlar ceza davasında delil olur mu? Kurtarılan veri, cache, silinmiş alan, metadata, adli imaj, hash ve kullanıcı bağlantısı nasıl değerlendirilir?"
series_id: "ncmec-dijital-delil"
series_order: 12
sources:
  - name: "Murat Volkan Dülger, Bilişim Suçları ve İnternet İletişim Hukuku, 11. Baskı, 2025."
  - name: "İsmail Akkaya, Bilgisayarlarda, Bilgisayar Programlarında ve Kütüklerinde Arama, Kopyalama ve Elkoyma (CMK m. 134), 1. Baskı, 2024."
  - name: "5271 sayılı Ceza Muhakemesi Kanunu, m. 134 ve m. 217."
    url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5271.pdf"
---

## Kısa cevap: Silinmiş veri delil olabilir, fakat bağlamı önemlidir

**Bir dosyanın veya mesajın silinmiş olması, geçmişte cihazda hiç bulunmadığı anlamına gelmez.** Adli bilişim incelemelerinde teknik koşullar elverdiğinde silinmiş dosyalar, mesaj kayıtları, uygulama verileri veya bunlara ait bazı izler kurtarılabilir.

Fakat “silinmiş dosya bulundu” cümlesi tek başına ceza sorumluluğunun bütün unsurlarını açıklamaz.

Hukuki değerlendirmede şu sorular önem kazanır:

**Veri nereden kurtarıldı? Tam mı, parçalı mı? Ne zaman oluştu? Nasıl silindi? Kullanıcı tarafından görülebilir miydi? Hangi hesap veya uygulamayla ilişkiliydi? Aynı veri başka delillerle doğrulanıyor mu?**

Serinin [önceki bölümünde adli bilişim bilirkişi raporuna itirazın](/makaleler/adli-bilisim-bilirkisi-raporuna-itiraz-hash-imaj-delil-butunlugu/) teknik omurgasını ele aldık. Silinmiş veri, bu raporların en çok bağlam gerektiren bölümlerinden biridir.

## Bir dosya silindiğinde gerçekten yok olur mu?

Her zaman hemen değil.

Bir dosyanın kullanıcı tarafından silinmesi, işletim sisteminin veya dosya sisteminin o veriyi aynı anda fiziksel olarak tamamen yok ettiği anlamına gelmeyebilir. Bazı sistemlerde dosyanın bulunduğu alan yeni veri yazılana kadar kısmen veya tamamen kurtarılabilir durumda kalabilir.

Adli bilişimde kullanılan yöntemler bu nedenle yalnız aktif dosyalara değil, silinmiş verilerin izlerine ve ayrılmamış alanlara da bakabilir.

Ancak teknolojik sonuç cihazın türüne, işletim sistemine, depolama yapısına, şifrelemeye, TRIM gibi mekanizmalara ve silme işleminden sonra cihazın ne kadar kullanıldığına göre değişebilir.

Bu nedenle **“silinen her şey geri gelir”** de **“silinen hiçbir şey bulunamaz”** da doğru değildir.

## Silinmiş dosyanın bulunması neyi gösterir?

En temel düzeyde, teknik olarak güvenilir biçimde kurtarılmış bir dosya belirli verinin geçmişte ilgili veri kaynağında bulunduğuna işaret edebilir.

Fakat bundan doğrudan;

- dosyayı sanığın indirdiği,
- içeriği gördüğü,
- bilinçli biçimde sakladığı,
- başkasına gönderdiği,
- silme işlemini kendisinin yaptığı

sonuçları otomatik olarak çıkarılamaz.

Silinmiş veri özellikle **geçmişteki varlığı** gösterebilir. Ceza sorumluluğu bakımından ise bu geçmiş varlığın hangi fiile ve hangi kişiye bağlandığı ayrıca araştırılır.

## Aktif dosya ile silinmiş dosya neden aynı değerlendirilmez?

Aktif bir klasörde kullanıcı tarafından erişilebilir durumda bulunan dosya ile yalnız adli bilişim aracıyla kurtarılabilen silinmiş veri arasında teknik fark vardır.

Aktif dosya;

- görüntülenebilir,
- taşınabilir,
- yeniden adlandırılabilir,
- paylaşılabilir

durumda olabilir.

Silinmiş veri ise kullanıcı arayüzünde artık görünmeyebilir ve yalnız dosya sistemi düzeyindeki incelemeyle tespit edilebilir.

Bu fark özellikle “bulundurma” veya bilinçli hâkimiyet tartışmalarında önem taşır. Ancak silinmiş olması da dosyanın geçmişte bilinçli şekilde bulundurulmuş olamayacağı anlamına gelmez.

Dolayısıyla hukuki değerlendirme **dosyanın yalnız bulunduğu anı değil, dijital yaşam döngüsünü** anlamaya çalışmalıdır.

## Silinmiş dosyanın tam mı parçalı mı olduğu neden önemlidir?

Adli bilişim incelemesinde bazen dosyanın tamamı kurtarılabilir; bazen yalnız küçük bir veri parçası, thumbnail, önizleme, dosya adı veya uygulama veritabanındaki kayıt bulunabilir.

Bu durumlar aynı ispat gücüne sahip değildir.

Örneğin;

- tam görsel dosyasının kurtarılması,
- yalnız küçük önizleme görselinin bulunması,
- yalnız dosya adına rastlanması,
- yalnız uygulama veritabanında mesaj kaydı görülmesi

farklı teknik sonuçlardır.

Bilirkişi raporu mümkün olduğunca **neyin gerçekten kurtarıldığını** açıklamalıdır. “Silinmiş içerik tespit edildi” şeklindeki genel ifade, verinin tamlığını ve hukuki anlamını değerlendirmek için yetersiz kalabilir.

## Cache ve önbellek kayıtları neden yanlış yorumlanabilir?

İnternet tarayıcıları ve uygulamalar performans amacıyla çeşitli geçici veriler oluşturabilir. Küçük görseller, medya önizlemeleri, web sayfası parçaları veya uygulama cache dosyaları kullanıcının ayrıca “kaydet” komutu vermesine gerek kalmadan cihazda oluşabilir.

Bu nedenle cache içinde bulunan veri ile kullanıcının özel klasöre kaydettiği dosya aynı davranışı göstermeyebilir.

Ancak cache verisi de tamamen önemsiz değildir. Belirli bir hesabın, sayfanın veya içeriğin cihazda görüntülenmiş olabileceğine ilişkin teknik iz sağlayabilir.

Doğru değerlendirme iki uçtan kaçınır:

- “Cache'de bulundu, kullanıcı bilinçli olarak sakladı.”
- “Cache'de bulundu, hiçbir anlamı yok.”

Asıl mesele cache kaydının **hangi uygulama tarafından, hangi olay sırasında ve hangi kullanıcı davranışıyla bağlantılı olarak oluştuğudur.**

## Silinmiş mesajlar nasıl değerlendirilebilir?

Mesajlaşma uygulamalarında bir mesaj kullanıcı arayüzünden silinse bile uygulama veritabanında, yedekte, karşı tarafın cihazında, bildirim kaydında veya bulut hesabında bazı izler kalabilir.

Bu nedenle “mesaj silindi” ile “mesajın varlığı hiçbir biçimde ispatlanamaz” aynı şey değildir.

Ancak mesaj içeriği değerlendirilirken;

- hangi cihazdan elde edildiği,
- gönderen ve alıcı hesapların kim olduğu,
- zaman damgası,
- mesajın tam mı parçalı mı olduğu,
- veritabanı kaydının bütünlüğü,
- karşı cihaz veya platform verisiyle doğrulanıp doğrulanmadığı

önem taşır.

Ekran görüntüsü, veritabanı kaydı ve platform sunucu kaydı aynı şey değildir. Her veri kaynağının ispat gücü kendi elde edilme ve doğrulanma biçimine göre değerlendirilir.

## Mesajın silinmiş olması suçluluk göstergesi midir?

Tek başına değil.

Bir kişinin belirli bir dosya veya mesajı silmesi olayın bağlamına göre anlam taşıyabilir. Fakat dijital sistemlerde veri;

- otomatik temizlik,
- uygulama ayarı,
- depolama alanı yönetimi,
- sohbet geçmişinin topluca silinmesi,
- bulut senkronizasyonu,
- cihaz değişikliği

gibi nedenlerle de kaybolabilir.

Bu nedenle “silmiş, demek ki suçunu biliyordu” biçimindeki doğrudan çıkarım dikkatle değerlendirilmelidir.

Silme işleminin zamanı, hangi kullanıcı tarafından yapıldığına ilişkin teknik izler ve olaydan önce veya sonra gerçekleşmesi gibi unsurlar varsa bunlar diğer delillerle birlikte anlam kazanabilir.

## Silinmiş görüntü TCK 226 bakımından bulundurma delili olabilir mi?

Olabilir, fakat yine otomatik sonuç yoktur.

TCK m.226'nın belirli fıkralarında bulundurma fiili ayrıca düzenlenmiştir. Silinmiş bir dosyanın güvenilir biçimde kurtarılması, o dosyanın geçmişte cihazda bulunduğunu gösterebilir ve bulundurma iddiasının delilleri arasında yer alabilir.

Ancak özellikle [telefonda veya bilgisayarda müstehcen görüntü bulunması](/makaleler/telefonda-bilgisayarda-mustehcen-goruntu-bulunmasi-yeterli-mi/) bölümünde ele aldığımız üzere;

- dosyanın nasıl geldiği,
- otomatik indirme veya senkronizasyon ihtimali,
- hangi klasörde bulunduğu,
- ne kadar süre kaldığı,
- kullanıcı tarafından açılıp taşınıp taşınmadığı,
- başkasına gönderilip gönderilmediği

failin içerikle iradi bağlantısı bakımından ayrıca önemlidir.

Silinmiş dosya, bu zincirin yalnız bir halkasıdır.

## NCMEC raporundaki dosya silinmiş alandan çıkarsa ne olur?

Bu durum önemli bir teknik eşleşme oluşturabilir.

Örneğin NCMEC raporunda belirli hash değerine sahip bir dosya bulunuyor ve aynı dosya cihazın silinmiş alanından güvenilir biçimde kurtarılıyorsa, rapor ile cihaz arasında maddi bağlantı güçlenebilir.

Fakat iki ayrı soru yine korunmalıdır:

1. **Aynı dosya mı?**
2. **Dosyayla ilgili fiili kim gerçekleştirdi?**

Hash değeri ilk soruyu güçlü biçimde cevaplayabilir. İkinci soru için cihazın kullanıcı yapısı, hesap kayıtları, zaman verileri ve dosyanın dijital bağlamı gerekir.

Bu nedenle [adli imaj ve hash hakkındaki bölüm](/makaleler/adli-imaj-hash-degeri-nedir-dijital-delil-degistirildi-mi/) silinmiş veri dosyalarında özellikle önemlidir.

## Silinmiş verinin tarih bilgisine ne kadar güvenilebilir?

Tarih ve saat bilgileri önemli olmakla birlikte teknik bağlamı bilinmeden kesin yorumlanmamalıdır.

Dosya sistemindeki oluşturma veya değiştirme zamanları;

- kopyalama,
- yedekten geri yükleme,
- bulut senkronizasyonu,
- işletim sistemi işlemleri,
- adli kurtarma yöntemi

nedeniyle farklı anlamlar taşıyabilir.

Bu nedenle bilirkişi raporu “dosya 14 Mart'ta oluşturulmuştur” dediğinde, hangi metadata alanına dayanıldığı ve o alanın somut sistemde neyi ifade ettiği önemlidir.

Dijital zaman verisi **tek başına olay anlatısı değil, doğru yorumlanması gereken teknik kayıttır.**

## Silinmiş veri üzerinde hash hesaplanabilir mi?

Tam ve tutarlı biçimde kurtarılan bir dosya üzerinde hash değeri hesaplanabilir. Bu, dosyanın başka bir örnekle karşılaştırılmasına yardımcı olabilir.

Ancak yalnız parçalı veya bozulmuş veri kurtarılmışsa aynı dosyanın orijinaliyle birebir hash eşleşmesi sağlanamayabilir.

Bu nedenle raporda “hash eşleşmedi” veya “hash alınamadı” sonucu da verinin tamlık durumuyla birlikte değerlendirilmelidir.

Hash'in yokluğu her zaman dosyanın farklı olduğu anlamına gelmez; bazen karşılaştırılabilir tam veri elde edilmemiş olabilir.

## Bulut yedeklerinden silinmiş içerik çıkması ne ifade eder?

Bir içerik telefondan silinmiş ancak Google Drive, iCloud, Google Photos veya başka bir bulut yedeğinde kalmış olabilir.

Bu durumda dosyanın yalnız cihaz üzerindeki geçmişi değil, hesabın senkronizasyon ve yedekleme yapısı da incelenmelidir.

Bulut hesabında dosyanın bulunması;

- dosyanın hangi cihazdan yüklendiği,
- otomatik yedeklemenin açık olup olmadığı,
- hesabı kimlerin kullandığı,
- yükleme ve silme zamanları

ile birlikte değerlendirilirse anlam kazanır.

Teknik olarak aynı dosyanın birden fazla cihazda görünmesi, her cihaz kullanıcısının dosyayı ayrı ayrı indirdiğini göstermez.

## Bilirkişi raporu silinmiş veri konusunda neyi açıklamalıdır?

Sağlıklı bir raporda en azından şu soruların cevapları aranabilir:

- Veri hangi cihaz veya imajdan kurtarıldı?
- Aktif mi silinmiş mi?
- Hangi dosya yolu veya veri alanında bulundu?
- Tam dosya mı, thumbnail mı, cache mi, veritabanı kaydı mı?
- Hash değeri üretilebildi mi?
- Zaman verileri hangi kaynaktan geliyor?
- Hangi kullanıcı veya uygulamayla ilişkilendirildi?
- Başka cihaz, hesap veya platform verisiyle doğrulanıyor mu?
- Kurtarma işlemi hangi araç ve yöntemle yapıldı?

Bu bilgiler yoksa “silinmiş dosya bulundu” sonucu teknik olarak doğru olsa bile hukuki anlamı yeterince açıklanmış olmayabilir.

## Silinmiş verinin hukuka uygun elde edilmesi de ayrıca önemlidir

Verinin silinmiş olması, onu ceza muhakemesindeki hukuka uygunluk kurallarının dışına çıkarmaz.

Cihazdan veya dijital veri kaynağından silinmiş verilerin kurtarılması da yapılan arama ve incelemenin kapsamı içinde değerlendirilmelidir. İncelemenin hukuki dayanağı, kararın kapsamı ve kullanılan yöntem [CMK 134 ve hukuka aykırı dijital delil](/makaleler/hukuka-aykiri-dijital-delil-telefon-bilgisayar-incelemesi/) bakımından ayrıca incelenebilir.

Bu nedenle dijital delilin iki kapısı burada da aynıdır:

**Önce veri hukuka uygun biçimde elde edildi mi? Sonra teknik olarak güvenilir ve sanıkla ilişkilendirilebilir mi?**

<div class="cyber-note"><strong>Silinmiş veri geçmişe açılan bir pencere olabilir, fakat tek başına geçmişin bütün hikâyesi değildir.</strong><br>Dosyanın cihazda daha önce bulunmuş olması ile onu kimin bilinçli biçimde edindiği, kullandığı, paylaştığı veya sildiği ayrı ayrı ispatlanmalıdır.</div>

## Sonuç

Silinmiş dosya ve mesajlar ceza davasında dijital delil olarak değerlendirilebilir. Ancak delil değeri yalnız “kurtarıldı” tespitinden doğmaz.

Sağlıklı değerlendirme şu sırayı izler:

**Verinin kaynağı → aktif/silinmiş ayrımı → tamlık → dosya konumu → zaman → hash ve bütünlük → kullanıcı bağlantısı → diğer delillerle doğrulama.**

Bu zincir kurulduğunda silinmiş verinin gerçekten neyi ispatladığı daha açık hâle gelir.

Bir sonraki aşamada dijital delilin cihaz dışındaki kaynağına geçeceğiz: **yurt dışındaki sosyal medya ve internet platformlarından IP, hesap ve trafik bilgilerinin nasıl temin edildiği.**
