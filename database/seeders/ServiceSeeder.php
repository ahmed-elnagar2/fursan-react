<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            [
                'title' => "اللحوم والدواجن والمجمدات",
                'title_en' => "Meat, Poultry & Frozen Foods",
                'description' => "أجود أنواع اللحوم البرازيلية والدواجن المجمدة، مع تشكيلة واسعة من الأسماك ومقطعات الدجاج المجهزة بعناية لتلبية كافة احتياجات التموين.",
                'description_en' => "Premium Brazilian meat and frozen poultry, offering a wide range of fish and carefully processed chicken parts for all catering needs.",
                'sort_order' => 1,
                'is_active' => true,
                'sub_services' => [
                    ['id' => Str::uuid(), 'name' => ['ar' => "لحم بقري برازيلي", 'en' => "Brazilian Beef"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "لحم بقري هندي", 'en' => "Indian Beef"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "دجاج مجمد كامل", 'en' => "Whole Frozen Chicken"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "مقطعات دجاج (صدور، أوراك)", 'en' => "Chicken Parts (Breasts, Thighs)"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "أسماك مجمدة", 'en' => "Frozen Fish"]],
                ]
            ],
            [
                'title' => "التخزين المبرد والمجمد",
                'title_en' => "Cold & Frozen Storage",
                'description' => "مساحات تخزين حديثة ومجهزة بأحدث التقنيات لضمان الحفاظ على المنتجات الغذائية في درجات حرارة مثالية سواء للتبريد أو التجميد.",
                'description_en' => "Modern storage spaces equipped with the highest tech to ensure food preservation at optimal temperatures for freezing or cooling.",
                'sort_order' => 2,
                'is_active' => true,
                'sub_services' => [
                    ['id' => Str::uuid(), 'name' => ['ar' => "تخزين مبرد (0 إلى 4 درجة)", 'en' => "Cold Storage (0 to 4 °C)"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "تخزين مجمد (-18 درجة فأقل)", 'en' => "Freezing Storage (-18 °C and below)"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "تخزين جاف", 'en' => "Dry Storage"]],
                ]
            ],
            [
                'title' => "المنتجات البلاستيكية والتغليف",
                'title_en' => "Plastics & Packaging",
                'description' => "مجموعة متكاملة من المنتجات البلاستيكية الآمنة غذائياً وأدوات التغليف التي تضمن سلامة منتجاتكم المعبأة والمحفوظة.",
                'description_en' => "A comprehensive range of food-grade plastics and packaging materials ensuring the safety of your packaged goods.",
                'sort_order' => 3,
                'is_active' => true,
                'sub_services' => [
                    ['id' => Str::uuid(), 'name' => ['ar' => "أكياس بلاستيكية للتعبئة", 'en' => "Plastic Packaging Bags"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "رولات ومواد تغليف", 'en' => "Wrapping Rolls"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "علب وحوافظ بلاستيكية", 'en' => "Plastic Containers"]],
                ]
            ],
            [
                'title' => "الإعاشة والتموين الشامل",
                'title_en' => "Comprehensive Catering",
                'description' => "خدمات تموين متكاملة ومصممة خصيصاً للشركات والمستشفيات والفنادق، مدعومة بمعايير جودة صارمة وجاهزية لا مثيل لها.",
                'description_en' => "Complete catering services tailored for corporates, hospitals, and hotels, backed by rigorous quality standards.",
                'sort_order' => 4,
                'is_active' => true,
                'sub_services' => [
                    ['id' => Str::uuid(), 'name' => ['ar' => "إعاشة شركات ومصانع", 'en' => "Corporate & Factory Catering"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "توريدات مستشفيات", 'en' => "Hospitals Supplies"]],
                    ['id' => Str::uuid(), 'name' => ['ar' => "تموين فنادق ومطاعم", 'en' => "Hotels & Restaurants Supply"]],
                ]
            ]
        ];

        foreach ($defaults as $item) {
            $item['id'] = (string) Str::uuid();
            Service::create($item);
        }
    }
}
