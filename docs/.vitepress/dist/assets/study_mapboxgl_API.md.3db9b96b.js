import{_ as n,c as o,o as t,N as a}from"./chunks/framework.d6f43b2b.js";const A=JSON.parse('{"title":"layers *","description":"","frontmatter":{},"headers":[],"relativePath":"study/mapboxgl/API.md","lastUpdated":null}'),s={name:"study/mapboxgl/API.md"},e=a(`<h1 id="layers" tabindex="-1">layers * <a class="header-anchor" href="#layers" aria-label="Permalink to &quot;layers \\*&quot;">​</a></h1><p>layers：图层集合（必填，包含了一系列图层 layer，这些图层指定了如何渲染数据源提供的数据）</p><p>&quot;layers&quot;: [] 每个图层 layer 都有 id（具有唯一性）和 type 属性，其中 type 属性指定了其具体的渲染类型：</p><ul><li>fill：填充</li><li>line：线</li><li>circle：圆点</li><li>symbol：符号</li><li>background：背景</li><li>raster：栅格</li><li>heatmap：热力图</li><li>hillshade：坡面阴影</li><li>fill-extrusion：三维填充</li><li>custom: 自定义图层</li></ul><h2 id="_1-fill" tabindex="-1">(1) fill <a class="header-anchor" href="#_1-fill" aria-label="Permalink to &quot;(1) fill&quot;">​</a></h2><p>fill：填充（用于给多边形 polygon 进行填充和描边）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;fill-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;fill&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）
        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
        },
        &quot;paint&quot;: { // 绘制类属性
            &quot;fill-antialias&quot;: true, // 填充时是否反锯齿（可选，默认值为 true）
            &quot;fill-opacity&quot;: 1, // 填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;fill-pattern&quot;: &quot;&quot;, // 填充用的图案（可选，这里填写在 sprite 雪碧图中图标名称。为了图案能无缝填充，图标的高宽需要是 2 的倍数）
            &quot;fill-color&quot;: &quot;#000000&quot;, // 填充的颜色（可选，默认值为 #000000。如果设置了 fill-pattern，则 fill-color 将无效）
            &quot;fill-outline-color&quot;: &quot;#000000&quot;, // 描边的颜色（可选，默认和 fill-color 一致。如果设置了 fill-pattern，则 fill-outline-color 将无效。为了使用此属性，还需要设置 fill-antialias 为 true）
            &quot;fill-translate&quot;: [0, 0], // 填充的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
            &quot;fill-translate-anchor&quot;: &quot;map&quot; // 平移的锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
        }
    }
]
</code></pre><h2 id="_2-line" tabindex="-1">(2) line <a class="header-anchor" href="#_2-line" aria-label="Permalink to &quot;(2) line&quot;">​</a></h2><p>line：线（用于绘制成一条条线）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;line-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;line&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）
        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
            &quot;line-cap&quot;: &quot;butt&quot;, // 线末端的显示样式（可选，可选值为 butt、round、square，默认值为 butt）
            // --- butt：方型末端（仅绘制到线的端点）
            // --- round：圆型末端（以线宽的 1/2 为半径，以线的端点为圆心，绘制圆型端点，会超出线的端点）
            // --- square：方型末端（以线宽的 1/2 长度超出线的端点）
            &quot;line-join&quot;: &quot;miter&quot;, // 线交叉时的显示样式（可选，可选值为 bevel、round、miter，默认值为 miter）
            // --- bevel：方型交点（以线宽的 1/2 长度超出线的交点）
            // --- round：圆型交点（以线宽的 1/2 为半径，以线的交点为圆心，绘制圆型交点，会超出线的交点）
            // --- miter：尖型交点（以两线段的外沿相交，超出交点绘制）
            &quot;line-miter-limit&quot;: 2, // 最大斜接长度（可选，用来将 miter 尖型交点自动转为 bevel 方型交点，默认值为 2。只有 line-join 为 miter 时，才需要设置此属性）
            &quot;line-round-limit&quot;: 1.05, // 最小圆角半径（可选，用来将 round 圆型交点自动转为 miter 尖型交点，默认值为 1.05。只有 line-join 为 round 时，才需要设置此属性）
        },
        &quot;paint&quot;: { // 绘制类属性
            &quot;line-opacity&quot;: 1, // 线的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;line-pattern&quot;: &quot;&quot;, // 线用的图案（可选，这里填写在 sprite 雪碧图中图标名称。为了图案能无缝填充，图标的高宽需要是 2 的倍数）
            &quot;line-color&quot;: &quot;#000000&quot;, // 线的颜色（可选，默认值为 #000000。如果设置了 line-pattern，则 line-color 将无效）
            &quot;line-translate&quot;: [0, 0], // 线的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
            &quot;line-translate-anchor&quot;: &quot;map&quot;, // 线的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
            &quot;line-width&quot;: 1, // 线的宽度（可选，值 &gt;= 0，默认值为 1，单位：像素）
            &quot;line-gap-width&quot;: 0, // 线的外部间距宽度（可选，值 &gt;= 0，默认值为 0，单位：像素。用来在线的外部再绘制一部分，此值表示内间距）
            &quot;line-offset&quot;: 0, // 线的偏移（可选，默认值为 0，单位：像素。对于单线，则是向右的偏移量；对于多边形，正值为内缩 inset，负值为外突 outset）
            &quot;line-blur&quot;: 0, // 线的模糊度（可选，值 &gt;= 0，默认值为 0，单位：像素）
            &quot;line-dasharray&quot;: [0, 0], // 虚线的破折号部分和间隔的长度（可选，默认值为 [0, 0]。如果设置了 line-pattern，则 line-dasharray 将无效）
            &quot;line-gradient&quot;: &quot;#000000&quot;, // 线的渐变色（可选。如果设置了 line-pattern 或 line-dasharray，则 line-gradient 将无效。只有数据源 source 的 type 为 geojson ，且 source 的 lineMetrics 为 true 时，line-gradient 才有效）
        }
    }
]
</code></pre><h2 id="_3-circle" tabindex="-1">(3) circle <a class="header-anchor" href="#_3-circle" aria-label="Permalink to &quot;(3) circle&quot;">​</a></h2><p>circle：圆点（用于绘制成一个个圆点）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;circle-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;circle&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）
        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
        },
        &quot;paint&quot;: { // 绘制类属性
            &quot;circle-opacity&quot;: 1, // 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;circle-radius&quot;: 5, // 圆点的半径（可选，值 &gt;= 0，默认值为 5，单位：像素）
            &quot;circle-color&quot;: &quot;#000000&quot;, // 圆点的颜色（可选，默认值为 #000000）
            &quot;circle-blur&quot;: 0, // 圆点的虚化（可选，默认值为 0。当值为 1 时，表示把圆虚化到只有圆心是不透明的）
            &quot;circle-translate&quot;: [0, 0], // 圆点的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
            &quot;circle-translate-anchor&quot;: &quot;map&quot;, // 圆点的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
            &quot;circle-pitch-scale&quot;: &quot;map&quot;, // 地图倾斜时圆点的缩放（可选，可选值为 map、viewport，默认为 map。值为 viewport 时，圆点不会缩放）
            &quot;circle-pitch-alignment&quot;: &quot;map&quot;, // 地图倾斜时圆点的对齐方式（可选，可选值为 map、viewport，默认为 map）
            &quot;circle-stroke-width&quot;: 0, // 圆点的描边宽度（可选，值 &gt;= 0，默认值为 0，单位：像素）
            &quot;circle-stroke-color&quot;: &quot;#000000&quot;, // 圆点的描边颜色（可选，默认值为 #000000）
            &quot;circle-stroke-opacity&quot;: 1 // 圆点的描边不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
        }
    }
]
</code></pre><h2 id="_4-symbol" tabindex="-1">(4) symbol <a class="header-anchor" href="#_4-symbol" aria-label="Permalink to &quot;(4) symbol&quot;">​</a></h2><p>symbol：符号（用于绘制成一个个图标或者文本标签等）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;symbol-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;symbol&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）
        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
            &quot;symbol-placement&quot;: &quot;point&quot;, // 符号的位置（可选，可选值为 point、line、line-center，默认值为 point）
            // --- point：符号在几何形状的点上
            // --- line：符号在几何形状的线上（几何形状只能为 LineString 或 Polygon）
            // --- line-center：符号在几何形状的线的中心点上（几何形状只能为 LineString 或 Polygon）
            &quot;symbol-spacing&quot;: 250, // 符号之间的距离（可选，值 &gt;= 1，默认值为 250，单位：像素。只有 symbol-placement 为 line 时才有效）
            &quot;symbol-avoid-edges&quot;: false, // 是否避免边缘冲突（可选，默认值为 false。当为 true 时，符号不会超过切片的边缘）
            &quot;symbol-sort-key&quot;: 1, // 排序的参考值（可选，无默认值。值越大，越在上方）
            &quot;symbol-z-order&quot;: &quot;auto&quot;, // z 轴上的顺序控制（可选，可选值为 auto、viewport-y、source，默认值为 auto）

            // 图标类属性（需要设置 icon-image）
            &quot;icon-image&quot;: &quot;&quot;, // 图标的图片（可选，这里填写在 sprite 雪碧图中图标名称）
            &quot;icon-size&quot;: 1, // 图标的大小（可选，值 &gt;= 0，默认值为 1。这里实际上是图标对应的原始图片的大小的缩放比例。值为 1 表示图标大小为原始图片的大小）
            &quot;icon-padding&quot;: 2, // 图标的外边距（可选，值 &gt;= 0，默认值为 2。可用于碰撞检测）
            &quot;icon-offset&quot;: [0, 0], // 图标的偏移量（可选，默认值为 [0, 0]）
            &quot;icon-anchor&quot;: &quot;center&quot;, // 图标与锚点的位置关系（可选，可选值为 center、left、right、top、bottom、top-left、top-right、bottom-left、bottom-right，默认值为 center）
            &quot;icon-rotation&quot;: 0, // 图标的顺时针旋转角度（可选，默认值为 0，单位：角度）
            &quot;icon-allow-overlap&quot;: false, // 是否允许图标重叠（可选，默认值为 false。当值为 true 时，图标即使和其他符号触碰也会显示）
            &quot;icon-ignore-placement&quot;: false, // 是否忽略图标位置（可选，默认值为 false。当值为 true 时，其他符号即使与此图标触碰也会显示）
            &quot;icon-optional&quot;: false, // 图标是否可不显示（可选，默认值为 false。当值为 true 时，如果图标与文本标签碰撞，则显示文本标签）
            &quot;icon-text-fit&quot;: &quot;none&quot;, // 图标与文本的大小适应关系（可选，可选值为 none、width、height、both，默认值为 none）
            // --- none：图标按其本身的比例显示
            // --- width：图标在 x 轴上缩放以适应文本的宽度
            // --- height：图标在 y 轴上缩放以适应文本的高度
            // --- both：图标在 x 和 y 轴上缩放以适应文本的宽高
            &quot;icon-text-fit-padding&quot;: [0, 0, 0, 0], // 图标与文本的内边距（可选，默认值为 [0,0,0,0]，单位：像素）
            &quot;icon-keep-upright&quot;: false, // 当 icon-rotation-alignment 为 map，且 symbol-placement 为 line 或者 line-center 时，设置为 true 的话，可以避免图标上下颠倒
            &quot;icon-rotation-alignment&quot;: &quot;auto&quot;, // 地图旋转时图标的对齐方式（可选，可选值为 map、viewport、auto，默认值为 auto）
            // --- map：当 symbol-placement 为 point 时，图标与地图的东西方向对齐；当 symbol-placement 为 line 时，图标的 x 轴和线对齐
            // --- viewport：图标的 x 轴和视口的 x 轴对齐
            // --- auto：当 symbol-placement 为 point 时，和 viewport 一致；当 symbol-placement 为 line 时，和 map 一致
            &quot;icon-pitch-alignment&quot;: &quot;auto&quot;, // 地图倾斜时图标的对齐方式（可选，可选值为 map、viewport、auto，默认值为 auto）
            // --- map：图标的 x 轴与地图平面对齐
            // --- viewport：图标的 x 轴和视口的 x 轴对齐
            // --- auto：当 symbol-placement 为 point 时，和 viewport 一致；当 symbol-placement 为 line 时，和 map 一致

            // 文本类属性（需要指定 text-field）
            &quot;text-rotation-alignment&quot;: &quot;auto&quot;, // 与 icon-rotation-alignment 类似
            &quot;text-pitch-alignment&quot;: &quot;auto&quot;, // 与 icon-pitch-alignment 类似
            &quot;text-field&quot;: &quot;&quot;, // 文本所对应的字段（可选，默认值为 &quot;&quot;）
            &quot;text-font&quot;: [&quot;Open Sans Regular&quot;,&quot;Arial Unicode MS Regular&quot;], // 文本的字体集合（可选，默认值为 [&quot;Open Sans Regular&quot;,&quot;Arial Unicode MS Regular&quot;]）
            &quot;text-size&quot;: 16, // 文本的大小（可选，默认值为 16，单位：像素）
            &quot;text-max-width&quot;: 10, // 文本的最大宽度，超过则折行（可选，默认值为 10，单位：ems）
            &quot;text-line-height&quot;: 1.2, // 文本的行高（可选，默认值为 1.2，单位：ems）
            &quot;text-letter-spacing&quot;: 0, // 文本的字符间距（可选，默认值为 0，单位：ems）
            &quot;text-justify&quot;: &quot;center&quot;, // 文本的水平对齐方式（可选，可选值为 auto、left、center、right。默认值为 center）
            &quot;text-anchor&quot;: &quot;center&quot;, // 文本与锚点的位置关系（可选，可选值为 center、left、right、top、bottom、top-left、top-right、bottom-left、bottom-right，默认值为 center）
            &quot;text-variable-anchor&quot;: &quot;center&quot;, // 与 text-anchor（优先级更高） 类似，有点不懂
            &quot;text-max-angle&quot;: 45, // 当 symbol-placement 为 line 或 line-center 时，文本相邻字符的最大夹角，默认 45 度
            &quot;text-rotate&quot;: 0, // 文本的顺时针旋转角度（可选，默认值为 0，单位：角度）
            &quot;text-padding&quot;: 2, // 文本的外边距（可选，值 &gt;= 0，默认值为 2。可用于碰撞检测）
            &quot;text-keep-upright&quot;: false, // 当 icon-rotation-alignment 为 map，且 symbol-placement 为 line 或者 line-center 时，设置为 true 的话，可以避免文本上下颠倒
            &quot;text-transform&quot;: &quot;none&quot;, // 文本大小写转换（可选，可选值为 none、uppercase、lowercase，默认值为 none）
            &quot;text-offset&quot;: [0, 0], // 图标的偏移量（可选，默认值为 [0, 0]）
            &quot;text-radial-offset&quot;: 0, // 文本的径向偏移量，优先级比 text-offset 高
            &quot;text-allow-overlap&quot;: false, // 是否允许文本重叠（可选，默认值为 false。当值为 true 时，文本即使和其他符号触碰也会显示）
            &quot;text-ignore-placement&quot;: false, // 是否忽略文本位置（可选，默认值为 false。当值为 true 时，其他符号即使与此文本触碰也会显示）
            &quot;text-optional&quot;: false // 文本是否可不显示（可选，默认值为 false。当值为 true 时，如果文本与图标碰撞，则显示图标）

        },
        &quot;paint&quot;: { // 绘制类属性

            // 图标类属性（需要设置 icon-image）
            &quot;icon-opacity&quot;: 1, // 图标的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;icon-color&quot;: &quot;#000000&quot;, // 图标的颜色（可选，默认值为 #000000）
            &quot;icon-halo-color&quot;: &quot;rgba(0,0,0,0)&quot;, // 图标的光晕颜色（可选，默认值为 rgba(0,0,0,0)）
            &quot;icon-halo-width&quot;: 0, // 图标的光晕宽度（可选，值 &gt;= 0，默认值为 0，单位：像素）
            &quot;icon-halo-blur&quot;: 0, // 图标的光晕模糊宽度（可选，值 &gt;= 0，默认值为 0，单位：像素）
            &quot;icon-translate&quot;: [0, 0], // 图标的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
            &quot;icon-translate-anchor&quot;: &quot;map&quot;, // 图标的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）

            // 文本类属性（需要设置 text-field）
            &quot;text-opacity&quot;: 1, // 文本的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;text-color&quot;: &quot;#000000&quot;, // 文本的颜色（可选，默认值为 #000000）
            &quot;text-halo-color&quot;: &quot;rgba(0,0,0,0)&quot;, // 文本的光晕颜色（可选，默认值为 rgba(0,0,0,0)）
            &quot;text-halo-width&quot;: 0, // 文本的光晕宽度（可选，值 &gt;= 0，默认值为 0，单位：像素）
            &quot;text-halo-blur&quot;: 0, // 文本的光晕模糊宽度（可选，值 &gt;= 0，默认值为 0，单位：像素）
            &quot;text-translate&quot;: [0, 0], // 文本的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）
            &quot;text-translate-anchor&quot;: &quot;map&quot;, // 文本的平移锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）
        }
    }
]
</code></pre><h2 id="_5-background" tabindex="-1">(5) background <a class="header-anchor" href="#_5-background" aria-label="Permalink to &quot;(5) background&quot;">​</a></h2><p>background：背景（用于绘制成整个地图的背景或者图案）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;background-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;background&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
        },
        &quot;paint&quot;: { // 绘制类属性
            &quot;background-color&quot;: &quot;#000000&quot;, // 背景颜色（可选，默认值为 #000000。如果设置了 background-pattern，则 background-color 将无效）
            &quot;background-pattern&quot;: &quot;&quot;, // 背景图案（可选，这里填写在 sprite 雪碧图中图标名称。为了背景图案能无缝填充，图标的高宽需要是 2 的倍数）
            &quot;background-opacity&quot;: 1 // 背景不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
        }
    }
]
</code></pre><h2 id="_6-raster" tabindex="-1">(6) raster <a class="header-anchor" href="#_6-raster" aria-label="Permalink to &quot;(6) raster&quot;">​</a></h2><p>raster：栅格（用于绘制栅格地图，比如卫星影像）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;raster-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;raster&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）
        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
        },
        &quot;paint&quot;: { // 绘制类属性
            &quot;raster-opacity&quot;: 1, // 图片的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;raster-hue-rotate&quot;: 0, // 在色轮上旋转色相的角度（可选，默认值为 0，单位：角度）
            &quot;raster-brightness-min&quot;: 0, // 图片的最小亮度（可选，取值范围为 0 ~ 1，默认值为 0）
            &quot;raster-brightness-max&quot;: 1, // 图片的最大亮度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;raster-saturation&quot;: 0, // 图片的饱和度（可选，取值范围为 -1 ~ 1，默认值为 0）
            &quot;raster-contrast&quot;: 0, // 图片的对比度（可选，取值范围为 -1 ~ 1，默认值为 0）
            &quot;raster-resampling&quot;: &quot;linear&quot;, // 采样方式（可选，可选值为 linear、nearest，默认值为 linear）
            &quot;raster-fade-duration&quot;: 300 // 切换瓦片时的渐隐时间（可选，默认值为 300，单位：毫秒）
        }
    }
]
</code></pre><h2 id="_7-heatmap" tabindex="-1">(7) heatmap <a class="header-anchor" href="#_7-heatmap" aria-label="Permalink to &quot;(7) heatmap&quot;">​</a></h2><p>heatmap：热力图（用于绘制成热力图的效果）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;heatmap-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;heatmap&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）
        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
        },
        &quot;paint&quot;: { // 绘制类属性
            &quot;heatmap-opacity&quot;: 1, // 热力图的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            &quot;heatmap-radius&quot;: 30, // 一个热力图点的影响半径（可选，值 &gt;= 1，默认值为 30，单位：像素）
            &quot;heatmap-weight&quot;: 1, // 一个热力图点的权重（可选，值 &gt;= 0，默认值为 1）
            &quot;heatmap-intensity&quot;: 1, // 热力图的强度，控制了所有的热力图点（可选，值 &gt;= 0，默认值为 1）
            &quot;heatmap-color&quot;: [ // 热力图的颜色变化（可选，默认值如下）
                &quot;interpolate&quot;, [&quot;linear&quot;], [&quot;heatmap-density&quot;],
                0, &quot;rgba(0, 0, 255, 0)&quot;,
                0.1, &quot;royalblue&quot;,
                0.3, &quot;cyan&quot;,
                0.5, &quot;lime&quot;,
                0.7, &quot;yellow&quot;,
                1, &quot;red&quot;
            ]
        }
    }
]
</code></pre><h2 id="_8-hillshade" tabindex="-1">(8) hillshade <a class="header-anchor" href="#_8-hillshade" aria-label="Permalink to &quot;(8) hillshade&quot;">​</a></h2><p>hillshade：坡面阴影（基于 DEM 数字高程模型进行坡面阴影的可视化渲染）</p><pre><code>&quot;layers&quot;: [
    {
        &quot;id&quot;: &quot;hillshade-id&quot;, // 唯一 id （必填）
        &quot;type&quot;: &quot;hillshade&quot;, // 类型（必填）
        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）
            &quot;mapbox:name&quot;: &quot;test&quot;
        },
        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）
        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）
        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）
        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）
        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）
        &quot;layout&quot;: { // 布局类属性
            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）
        },
        &quot;paint&quot;: { // 绘制类属性
            &quot;hillshade-illumination-direction&quot;: 335, // 光照的方向（可选，取值范围为 0 ~ 359，默认值为 335，单位：角度）
            &quot;hillshade-illumination-anchor&quot;: &quot;viewport&quot;, // 光照的锚点（可选，可选值为 map、viewport，默认值为 viewport）
            &quot;hillshade-exaggeration&quot;: 0.5, // 阴影的强度（可选，取值范围为 0 ~ 1，默认值为 0.5）
            &quot;hillshade-shadow-color&quot;: &quot;#000000&quot;, // 阴影的颜色（可选，默认值为 #000000）
            &quot;hillshade-highlight-color&quot;: &quot;#ffffff&quot;, // 光照部分的颜色（可选，默认值为 #ffffff）
            &quot;hillshade-accent-color&quot;: &quot;#000000&quot; // 用于强调地形的颜色（可选，默认值为 #000000）
        }
    }
]
</code></pre><h2 id="_9-fill-extrusion" tabindex="-1">(9) fill-extrusion <a class="header-anchor" href="#_9-fill-extrusion" aria-label="Permalink to &quot;(9) fill-extrusion&quot;">​</a></h2><p>fill-extrusion：三维填充（用于给三维多边形进行填充和描边）</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">&quot;layers&quot;: [</span></span>
<span class="line"><span style="color:#A6ACCD;">    {</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;id&quot;: &quot;fill-extrusion-id&quot;, // 唯一 id （必填）</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;type&quot;: &quot;fill-extrusion&quot;, // 类型（必填）</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;metadata&quot;: { // 元数据（可选，用于为 layer 附加任意的属性。为避免冲突，建议添加前缀，如 mapbox:）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;mapbox:name&quot;: &quot;test&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">        },</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;source&quot;: &quot;source-name&quot;, // 数据源的名称（除了 layer 的 type 为 background 外，source 必填）</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;source-layer&quot;: &quot;source-layer-name&quot;, // 数据源的图层（只有数据源 source 的 type 为 vector 时，才能设置 source-layer，其他类型的不可以设置）</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;minzoom&quot;: 0, // 最小层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 小于此 minzoom 时，layer 将被隐藏）</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;maxzoom&quot;: 24, // 最大层级（可选，取值范围为 0 ~ 24。当 style 的 zoom 大于此 maxzoom 时，layer 将被隐藏）</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;filter&quot;: [], // 过滤（可选，用特定的表达式过滤指定的数据源的要素。具体的表达式详见 expression）</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;layout&quot;: { // 布局类属性</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;visibility&quot;: &quot;visible&quot;, // 可见性（可选，可选值为 none、visible，默认值为 visible）</span></span>
<span class="line"><span style="color:#A6ACCD;">        },</span></span>
<span class="line"><span style="color:#A6ACCD;">        &quot;paint&quot;: { // 绘制类属性</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-opacity&quot;: 1, // 三维填充的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-pattern&quot;: &quot;&quot;, // 三维填充的图案（可选，这里填写在 sprite 雪碧图中图标名称。为了图案能无缝填充，图标的高宽需要是 2 的倍数）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-color&quot;: &quot;#000000&quot;, // 三维填充的颜色（可选，默认值为 #000000）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-translate&quot;: [0, 0], // 三维填充的平移（可选，通过平移 [x, y] 达到一定的偏移量。默认值为 [0, 0]，单位：像素。）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-translate-anchor&quot;: &quot;map&quot;, // 平移的锚点，即相对的参考物（可选，可选值为 map、viewport，默认为 map）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-height&quot;: 0, // 三维填充的高度（可选，值 &gt;= 0，默认值为 0，单位：米）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-base&quot;: 0, // 三维填充的底部高度（可选，值 &gt;= 0，默认值为 0，单位：米。值必须小于等于 fill-extrusion-height）</span></span>
<span class="line"><span style="color:#A6ACCD;">            &quot;fill-extrusion-vertical-gradient&quot;: true, // 是否开启垂直渐变（可选，默认值为 true）</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="_10-custom" tabindex="-1">(10) custom <a class="header-anchor" href="#_10-custom" aria-label="Permalink to &quot;(10) custom&quot;">​</a></h2><p>自定义图层</p><ul><li>onAdd(map, gl)，初始化 webgl</li><li>render(gl, matrix), 每一帧都会 call 这个 render 函数，可以在这里注入需要在 webgl 上下文中渲染的操作</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">var customLayer = {</span></span>
<span class="line"><span style="color:#A6ACCD;">    id: &#39;3d-terrain&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    type: &#39;custom&#39;,  // 指定是自定义图层，不然就是 fill，symbol 等图层.</span></span>
<span class="line"><span style="color:#A6ACCD;">    renderingMode: &#39;3d&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">    onAdd: function (map, gl) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.camera = new THREE.Camera();</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.scene = new THREE.Scene();</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.map = map;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        // use the Mapbox GL JS map canvas for three.js</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.renderer = new THREE.WebGLRenderer({</span></span>
<span class="line"><span style="color:#A6ACCD;">            canvas: map.getCanvas(),</span></span>
<span class="line"><span style="color:#A6ACCD;">            context: gl // 用mapbox 的webgl作为threejs 的上下文.</span></span>
<span class="line"><span style="color:#A6ACCD;">        });</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        // 把Threejs 的scene，camera以及renderer 传入自定义的terrainLoader中，以便add(bufferPlaneMesh)</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.terrainLoader = new TerrainLoader({</span></span>
<span class="line"><span style="color:#A6ACCD;">            scene: this.scene,</span></span>
<span class="line"><span style="color:#A6ACCD;">            camera: this.camera,</span></span>
<span class="line"><span style="color:#A6ACCD;">            renderer: this.renderer</span></span>
<span class="line"><span style="color:#A6ACCD;">        });</span></span>
<span class="line"><span style="color:#A6ACCD;">    },</span></span>
<span class="line"><span style="color:#A6ACCD;">    render: function (gl, matrix) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        // ..省略部分 以下是将mapbox的matrix 参数同步给threejs 实例</span></span>
<span class="line"><span style="color:#A6ACCD;">        // sync mapbox matrix with THREE camera Matrix.</span></span>
<span class="line"><span style="color:#A6ACCD;">        var m = new THREE.Matrix4().fromArray(matrix);</span></span>
<span class="line"><span style="color:#A6ACCD;">        var l = new THREE.Matrix4().makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)</span></span>
<span class="line"><span style="color:#A6ACCD;">            .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))</span></span>
<span class="line"><span style="color:#A6ACCD;">            .multiply(rotationX)</span></span>
<span class="line"><span style="color:#A6ACCD;">            .multiply(rotationY)</span></span>
<span class="line"><span style="color:#A6ACCD;">            .multiply(rotationZ);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        // sync mapbox matrix with THREE camera. 更新threejs camera的投影矩阵，重新渲染，再强制触发下mapbox 的repaint，这样动画就可以继续进行了</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.camera.projectionMatrix.elements = matrix;</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.camera.projectionMatrix = m.multiply(l);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.renderer.state.reset();</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.renderer.render(this.scene, this.camera);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.map.triggerRepaint();</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">// 把customlayer 加入label 之下，这样文字标注就可以浮在地形图层之上</span></span>
<span class="line"><span style="color:#A6ACCD;">map.on(&#39;style.load&#39;, function () {</span></span>
<span class="line"><span style="color:#A6ACCD;">    map.addLayer(customLayer, &#39;roads labels&#39;);</span></span>
<span class="line"><span style="color:#A6ACCD;">});</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">&lt;template&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;div&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">&lt;/template&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">&lt;script&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">// import modelMtl from  &quot;./models/triangle.mtl&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">// import modelObj from &quot;./models/triangle.obj&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">import modelMtl from  &quot;./models/三角锥.mtl&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">import modelObj from &quot;./models/三角锥.obj&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">export default {</span></span>
<span class="line"><span style="color:#A6ACCD;">    inject: [&#39;map&#39;, &#39;baseMap&#39;],</span></span>
<span class="line"><span style="color:#A6ACCD;">    methods: {</span></span>
<span class="line"><span style="color:#A6ACCD;">        init() {</span></span>
<span class="line"><span style="color:#A6ACCD;">            let targetLnglat = [114.0600586, 22.5296825];</span></span>
<span class="line"><span style="color:#A6ACCD;">            this.map.flyTo({</span></span>
<span class="line"><span style="color:#A6ACCD;">                center: targetLnglat,</span></span>
<span class="line"><span style="color:#A6ACCD;">                zoom: 14,</span></span>
<span class="line"><span style="color:#A6ACCD;">                pitch: 60</span></span>
<span class="line"><span style="color:#A6ACCD;">            });</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            window.map = this.map;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            this.map.addLayer({</span></span>
<span class="line"><span style="color:#A6ACCD;">                id: &#39;custom_layer&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">                type: &#39;custom&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">                renderingMode: &#39;3d&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">                onAdd: (map, mbxContext) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">                    this.tbInstance = new Threebox(</span></span>
<span class="line"><span style="color:#A6ACCD;">                        this.map,</span></span>
<span class="line"><span style="color:#A6ACCD;">                        mbxContext, {</span></span>
<span class="line"><span style="color:#A6ACCD;">                            defaultLights: true</span></span>
<span class="line"><span style="color:#A6ACCD;">                        }</span></span>
<span class="line"><span style="color:#A6ACCD;">                    );</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">                    this.loadModel(targetLnglat);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">                },</span></span>
<span class="line"><span style="color:#A6ACCD;">                render: (gl, matrix) =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">                    this.tbInstance.update();</span></span>
<span class="line"><span style="color:#A6ACCD;">                }</span></span>
<span class="line"><span style="color:#A6ACCD;">            });</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        },</span></span>
<span class="line"><span style="color:#A6ACCD;">        loadModel(targetLnglat) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            var options = {</span></span>
<span class="line"><span style="color:#A6ACCD;">                obj: modelObj,</span></span>
<span class="line"><span style="color:#A6ACCD;">                mtl: modelMtl,</span></span>
<span class="line"><span style="color:#A6ACCD;">                scale: 2,</span></span>
<span class="line"><span style="color:#A6ACCD;">                rotation: {</span></span>
<span class="line"><span style="color:#A6ACCD;">                    x: 0,</span></span>
<span class="line"><span style="color:#A6ACCD;">                    y: 0,</span></span>
<span class="line"><span style="color:#A6ACCD;">                    z: 0</span></span>
<span class="line"><span style="color:#A6ACCD;">                }</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            this.tbInstance.loadObj(options, model =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">                this.model = model;</span></span>
<span class="line"><span style="color:#A6ACCD;">                this.tbInstance.add(model);</span></span>
<span class="line"><span style="color:#A6ACCD;">                model.setCoords(targetLnglat);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">                this.startAnimation();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            });</span></span>
<span class="line"><span style="color:#A6ACCD;">        },</span></span>
<span class="line"><span style="color:#A6ACCD;">        startAnimation() {</span></span>
<span class="line"><span style="color:#A6ACCD;">            let rotateValue = 0;</span></span>
<span class="line"><span style="color:#A6ACCD;">            const ani = () =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">                rotateValue += 0.5;</span></span>
<span class="line"><span style="color:#A6ACCD;">                this.model.setRotation(rotateValue % 360);</span></span>
<span class="line"><span style="color:#A6ACCD;">                requestAnimationFrame(ani);</span></span>
<span class="line"><span style="color:#A6ACCD;">            }</span></span>
<span class="line"><span style="color:#A6ACCD;">            requestAnimationFrame(ani);</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    },</span></span>
<span class="line"><span style="color:#A6ACCD;">    mounted() {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.init();</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">&lt;/script&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,36),l=[e];function p(u,r,i,q,c,m){return t(),o("div",null,l)}const C=n(s,[["render",p]]);export{A as __pageData,C as default};
