import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Research.module.css';

const Research: React.FC = () => {
    const { t, language } = useLanguage();

    const researchLines = [
        {
            id: 1,
            title_en: "Prebiotic Chemistry and Catalysis",
            title_pt: "Química Prebiótica e Catálise",
            desc_en: "This research line explores prebiotic chemistry and catalysis, focusing on how simple and earth-abundant metals could have promoted chemical transformations under early Earth conditions. We investigate catalytic processes in water using abundant metals, aiming to understand reaction pathways relevant to the origins of life, while simultaneously uncovering novel catalytic transformations inspired by prebiotic environments.\n\nBy combining fundamental chemistry with sustainability principles, this research connects early chemical evolution to modern catalytic concepts, offering students training at the interface of catalysis, green chemistry, and origin-of-life research.",
            desc_pt: "Esta linha de pesquisa explora a química prebiótica e a catálise, com foco em como metais simples e abundantes na Terra poderiam ter promovido transformações químicas nas condições da Terra primitiva. Investigamos processos catalíticos em água utilizando metais abundantes, visando compreender vias de reação relevantes para as origens da vida, ao mesmo tempo em que descobrimos novas transformações catalíticas inspiradas em ambientes prebióticos.\n\nAo combinar química fundamental com princípios de sustentabilidade, esta pesquisa conecta a evolução química primitiva a conceitos catalíticos modernos, oferecendo aos estudantes treinamento na interface da catálise, química verde e pesquisa sobre a origem da vida.",
            image: "/images/research/prebiotic.png",
            alt: "Prebiotic Chemistry Illustration"
        },
        {
            id: 2,
            title_en: "Ligand Design for Advanced Catalysis",
            title_pt: "Design de Ligantes para Catálise Avançada",
            desc_en: "This research line focuses on the design of ligands to transmute the catalytic activity of non-noble metals, enabling them to mimic—or ideally surpass—the performance of noble-metal-based catalysts. By tailoring the electronic and steric properties of ligands, we aim to unlock new reactivity patterns and enhance the efficiency, selectivity, and robustness of catalysts based on earth-abundant metals.\n\nA central aspect of this work is the development of non-innocent ligands whose degree of cooperation with the metal center can vary. In some systems, ligands act in close synergy with the metal through metal–ligand cooperativity, while in others they can perform key catalytic functions partially or even independently of the metal center, such as electron or proton transfer, substrate activation, or stabilization of reactive intermediates. This strategy bridges fundamental organometallic chemistry and sustainable catalyst design.",
            desc_pt: "Esta linha de pesquisa foca no design de ligantes para transmutar a atividade catalítica de metais não nobres, permitindo que imitem—ou idealmente superem—o desempenho de catalisadores baseados em metais nobres. Ao ajustar as propriedades eletrônicas e estéricas dos ligantes, visamos desbloquear novos padrões de reatividade e aumentar a eficiência, seletividade e robustez de catalisadores baseados em metais abundantes na Terra.\n\nUm aspecto central deste trabalho é o desenvolvimento de ligantes não inocentes cujo grau de cooperação com o centro metálico pode variar. Em alguns sistemas, os ligantes agem em estreita sinergia com o metal através da cooperatividade metal-ligante, enquanto em outros podem desempenhar funções catalíticas chave parcial ou até independentemente do centro metálico, como transferência de elétrons ou prótons, ativação de substratos ou estabilização de intermediários reativos. Esta estratégia conecta a química organometálica fundamental ao design sustentável de catalisadores.",
            image: "/images/research/ligand.png",
            alt: "Ligand Design Structure"
        },
        {
            id: 3,
            title_en: "Valorization of Biorenewable Feedstocks",
            title_pt: "Valorização de Matérias-Primas Biorrenováveis",
            desc_en: "This research line focuses on the valorization of biorenewable feedstocks, aiming to transform renewable substances into value-added chemicals with potential industrial relevance. Using catalytic strategies grounded in green chemistry principles, we develop efficient and selective routes to convert biomass-derived molecules into fuels, additives, fine chemicals, and functional intermediates.\n\nOur work bridges fundamental catalysis and applied chemistry, emphasizing reaction efficiency, sustainability, and scalability. By addressing challenges related to selectivity, process integration, and catalyst design, this research line prepares students to work at the interface of academic research and industrial innovation.",
            desc_pt: "Esta linha de pesquisa foca na valorização de matérias-primas biorrenováveis, visando transformar substâncias renováveis em produtos químicos de alto valor agregado com potencial relevância industrial. Utilizando estratégias catalíticas fundamentadas nos princípios da química verde, desenvolvemos rotas eficientes e seletivas para converter moléculas derivadas de biomassa em combustíveis, aditivos, produtos químicos finos e intermediários funcionais.\n\nNosso trabalho conecta a catálise fundamental e a química aplicada, enfatizando a eficiência da reação, sustentabilidade e escalabilidade. Ao abordar desafios relacionados à seletividade, integração de processos e design de catalisadores, esta linha de pesquisa prepara os estudantes para atuar na interface da pesquisa acadêmica e inovação industrial.",
            image: "/images/research/biomass.png",
            alt: "Biomass Valorization"
        }
    ];

    return (
        <div className={styles.researchPage}>
            {/* Header */}
            <section className={styles.header}>
                <div className="container">
                    <h1 className={styles.headerTitle}>{t('nav.research')}</h1>
                    <p className={styles.headerSubtitle}>
                        {language === 'pt'
                            ? 'Explorando novas fronteiras na química para um futuro sustentável.'
                            : 'Exploring new frontiers in chemistry for a sustainable future.'}
                    </p>
                </div>
            </section>

            {/* Content Zigzag */}
            <section className={styles.contentWrapper}>
                {researchLines.map((line) => (
                    <div key={line.id} className={styles.researchBlock}>
                        <div className={styles.imageWrapper}>
                            <img src={line.image} alt={line.alt} className={styles.researchImage} />
                        </div>
                        <div className={styles.textContent}>
                            <h2 className={styles.contentTitle}>
                                {language === 'pt' ? line.title_pt : line.title_en}
                            </h2>
                            <p className={styles.description}>
                                {language === 'pt' ? line.desc_pt : line.desc_en}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Research;
