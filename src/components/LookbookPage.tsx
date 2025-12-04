import React, { useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const LookbookPage: React.FC = () => {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const lookbookImages = [
    {
      url: 'https://lupl.notion.site/image/attachment%3A4b2659ce-4c61-46b0-8c09-6427adf23604%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210476.jpg?table=block&id=2bea6583-95de-8084-84d7-f05d669e1c1b&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2 ',
      title: 'Minimalist Elegance',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A3da33224-6c44-4b05-a3a7-fd6c3263474d%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210539.jpg?table=block&id=2bea6583-95de-80e7-8d62-c07655fdebe3&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Editorial Black',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Ab29f9187-265d-4ca2-a103-09589c800f7e%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210667.jpg?table=block&id=2bea6583-95de-807c-9383-ec0acc1af0fa&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Studio Collection',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A814681ab-435f-40dc-a48e-c37fba58cf6e%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210682.jpg?table=block&id=2bea6583-95de-80c1-9903-cba0890fb368&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Monochrome',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Ae0121186-0de6-4cc3-b65d-11f609955fa7%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210727.jpg?table=block&id=2bea6583-95de-800c-aa5e-dcfee1fc718c&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Lookbook Essential',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A337cac6c-dbdb-4c09-ab8d-f1b63b3101f3%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210751.jpg?table=block&id=2bea6583-95de-80e7-9b83-ce79ece3e659&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Designer Details',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Ab0af38d0-6c9d-4b0a-8dce-6cc54573c0c9%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210855.jpg?table=block&id=2bea6583-95de-80db-9886-f48c66137ae4&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Runway Moment',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Aa7393f6b-45cf-4b87-a405-102a8f899d52%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210879.jpg?table=block&id=2bea6583-95de-8032-8fc3-fc03aebf8054&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Minimalist Apparel',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A8a0000b7-a1af-4df9-924c-fcbebac6dcd6%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210957.jpg?table=block&id=2bea6583-95de-80c3-aa02-ceac51477594&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A8a0000b7-a1af-4df9-924c-fcbebac6dcd6%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210957.jpg?table=block&id=2bea6583-95de-80c3-aa02-ceac51477594&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A33b4bfc6-3613-4b94-a29d-c114ff6a04f4%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210972.jpg?table=block&id=2bea6583-95de-80fd-945f-cd2ab1b3d0ca&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Aa6de7b3f-33d5-4a28-9987-93c97234ccf4%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A211015.jpg?table=block&id=2bea6583-95de-80d5-b91c-c3eac106155c&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A8a0000b7-a1af-4df9-924c-fcbebac6dcd6%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210957.jpg?table=block&id=2bea6583-95de-80c3-aa02-ceac51477594&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A33b4bfc6-3613-4b94-a29d-c114ff6a04f4%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210972.jpg?table=block&id=2bea6583-95de-80fd-945f-cd2ab1b3d0ca&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Aa6de7b3f-33d5-4a28-9987-93c97234ccf4%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A211015.jpg?table=block&id=2bea6583-95de-80d5-b91c-c3eac106155c&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Ad731eb2b-4b28-41f7-9c60-9d6f8c7224e8%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210112.jpg?table=block&id=2bea6583-95de-8097-8b43-cf87492bf7de&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A2408b468-9d30-4108-ab18-60b83f1c500a%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210144.jpg?table=block&id=2bea6583-95de-808d-bcd8-e9fd7694808c&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Abc415824-8081-4b21-bc29-6ca57dee0161%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210174.jpg?table=block&id=2bea6583-95de-80a5-afba-e50089bfd0d8&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Abf02486d-c842-461a-8da6-af2ad8becd36%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210191.jpg?table=block&id=2bea6583-95de-80b1-b76a-d052b03d2da0&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Ad17a4e6f-0b1c-4b16-a35c-fa080bd99e91%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210197.jpg?table=block&id=2bea6583-95de-80ed-a35c-f39b498a5a08&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A532008a9-093c-4d65-a38e-d349b3aef654%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210257.jpg?table=block&id=2bea6583-95de-8023-92f5-e51201a2cbd8&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A0e52360f-20f2-4c00-bce5-029966568c33%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210288.jpg?table=block&id=2bea6583-95de-80f5-97e3-e7e08ef7f18b&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A3d274475-79e6-4806-8d55-a3f3c013a1ff%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210311.jpg?table=block&id=2bea6583-95de-8066-8cee-dd6917408562&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A8700abb9-305b-4bd1-aecd-f077b125e344%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A210330.jpg?table=block&id=2bea6583-95de-80de-9935-cefc432783a1&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Aa64dbd18-973c-4a25-8068-13c35b914f09%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29696.jpg?table=block&id=2bea6583-95de-80c9-9dcd-f0039df3a5b8&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Af6c650fe-2cfb-4c31-9426-b81752c75db8%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29727.jpg?table=block&id=2bea6583-95de-802f-a9e1-ea0d16ea3fc9&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A016436a1-eb0a-4c28-a1ec-187d3db951b3%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29747.jpg?table=block&id=2bea6583-95de-8073-a017-ee84db811a59&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A812bae98-a634-4044-82e3-d91f5067dfb1%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29762.jpg?table=block&id=2bea6583-95de-8073-9f68-d7f509a27c27&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A711b60a3-4d83-4b59-b8b2-3ceadb331cf9%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29814.jpg?table=block&id=2bea6583-95de-802d-bbf1-e31825b28172&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A68339750-8d8e-446a-ac7e-f07a5ee56b0a%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29836.jpg?table=block&id=2bea6583-95de-80b8-9b77-fbbdc32f1e2a&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Afbd31fdb-ebf1-4702-9dae-699f0e1f8fe2%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29857.jpg?table=block&id=2bea6583-95de-801b-8546-fe5be2cb26db&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A20baea20-907b-4cd9-98d3-3e20b94d86f6%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29863.jpg?table=block&id=2bea6583-95de-8052-810b-fc4f0d9d4103&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3A99a72845-44db-4a23-a540-b80fdb61386b%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29870.jpg?table=block&id=2bea6583-95de-809d-8a3b-d97b17681d3d&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
    {
      url: 'https://lupl.notion.site/image/attachment%3Af8c87f56-c5b2-4fd6-8f3c-1d5bcbde4d2c%3A%E1%84%80%E1%85%B5%E1%84%90%E1%85%A29959.jpg?table=block&id=2bea6583-95de-80c5-95c4-d69752c7dafc&spaceId=0293b3b4-0688-440a-bb5a-3948efeda036&width=1250&userId=&cache=v2',
      title: 'Contrast',
    },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-4">{t('lookbook.title')}</h1>
          <p className="text-sm sm:text-base tracking-[0.2em] text-muted-foreground">{t('lookbook.season')}</p>
        </div>

        {/* Desktop Masonry Grid */}
        <Masonry columnsCount={3} gutter="16px" className="hidden lg:block">
          {lookbookImages.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <ImageWithFallback
                src={item.url}
                alt={item.title}
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                  <p className="text-white tracking-[0.2em] text-lg">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </Masonry>

        {/* Tablet Masonry Grid */}
        <Masonry columnsCount={2} gutter="16px" className="hidden sm:block lg:hidden">
          {lookbookImages.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <ImageWithFallback
                src={item.url}
                alt={item.title}
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                  <p className="text-white tracking-[0.2em] text-base">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </Masonry>

        {/* Mobile Grid */}
        <div className="sm:hidden grid grid-cols-1 gap-6">
          {lookbookImages.map((item, index) => (
            <div key={index} className="relative overflow-hidden">
              <ImageWithFallback
                src={item.url}
                alt={item.title}
                className="w-full"
              />
              <div className="mt-2 text-center text-sm tracking-wide">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};