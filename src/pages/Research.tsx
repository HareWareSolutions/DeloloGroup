import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Research.module.css';

const Research: React.FC = () => {
    const { t, language } = useLanguage();

    const researchLines = [
        {
            id: 1,
            title_en: "Prebiotic Chemistry",
            title_pt: "Química Prebiótica",
            desc_en: "Prebiotic chemistry is the field of chemistry that investigates how simple molecules present on early Earth could have reacted and organized themselves, under abiotic conditions, giving rise to organic compounds and molecular systems that preceded the emergence of life. Our research seeks to understand how earth-abundant metals, in aqueous media, could have acted as catalysts in these processes, helping to reveal chemical pathways that may have been fundamental to the origin of life while simultaneously inspiring the development of new catalytic reactions based on prebiotic scenarios.",
            desc_pt: "A química prebiótica é o campo da química que investiga como moléculas simples presentes na Terra primitiva puderam reagir e se organizar, sob condições abióticas, dando origem aos compostos orgânicos e aos sistemas moleculares que precederam o surgimento da vida. Nossa pesquisa busca entender como metais abundantes, em meio aquoso, podem ter atuado como catalisadores nesses processos, ajudando a revelar caminhos químicos que podem ter sido fundamentais para a origem da vida e, ao mesmo tempo, inspirando o desenvolvimento de novas reações catalíticas baseadas em cenários prebióticos.",
            image: "/images/research/prebiotic.png",
            alt: "Prebiotic Chemistry Illustration"
        },
        {
            id: 2,
            title_en: "Ligand Design for Catalysis",
            title_pt: "Design de Ligantes para Catálise",
            desc_en: "Catalysis with non-noble and earth-abundant metals investigates the use of widely available elements as sustainable alternatives to noble metals traditionally employed in catalytic processes. Our research focuses on rational ligand design as a central tool to transmute the catalytic activity of these metals, enabling them to mimic—or ideally surpass—the performance of noble-metal-based catalysts. By precisely tailoring the electronic and steric properties of ligands, we aim to unlock new reactivity patterns and enhance the efficiency, selectivity, and robustness of catalytic systems based on earth-abundant metals.",
            desc_pt: "A catálise com metais não nobres e abundantes investiga o uso de elementos amplamente disponíveis na Terra como alternativas sustentáveis aos metais nobres tradicionalmente empregados em processos catalíticos. Nossa pesquisa foca no design racional de ligantes como ferramenta central para transmutar a atividade catalítica desses metais, permitindo que imitem — ou idealmente superem — o desempenho de catalisadores baseados em metais nobres. Ao ajustar de forma precisa as propriedades eletrônicas e estéricas dos ligantes, buscamos desbloquear novos padrões de reatividade e ampliar a eficiência, a seletividade e a robustez de sistemas catalíticos baseados em metais abundantes na crosta terrestre.",
            image: "/images/research/ligand.png",
            alt: "Ligand Design Structure"
        },
        {
            id: 3,
            title_en: "Valorization of Biorenewable Feedstocks",
            title_pt: "Valorização de Matérias-Primas Biorrenováveis",
            desc_en: "The valorization of biorenewable feedstocks investigates how renewable resources can be converted into higher value-added chemicals, contributing to the development of more sustainable processes aligned with current industrial demands. Our research seeks to develop efficient and selective catalytic strategies, grounded in green chemistry principles, to transform biomass-derived molecules into fuels, additives, fine chemicals, and functional intermediates. By integrating fundamental catalysis and applied chemistry, we pay special attention to the scalability of processes, aiming for the transition from benchtop discoveries to larger-scale applications and, potentially, to the market. In this way, we seek to reduce technological barriers, increase the robustness of catalytic systems, and contribute to translating scientific knowledge into sustainable chemical solutions with industrial impact.",
            desc_pt: "A valorização de matérias-primas biorrenováveis investiga como recursos renováveis podem ser convertidos em produtos químicos de maior valor agregado, contribuindo para o desenvolvimento de processos mais sustentáveis e alinhados às demandas industriais atuais. Nossa pesquisa busca desenvolver estratégias catalíticas eficientes e seletivas, fundamentadas nos princípios da química verde, para transformar moléculas derivadas de biomassa em combustíveis, aditivos, produtos químicos finos e intermediários funcionais. Ao integrar catálise fundamental e química aplicada, damos especial atenção à viabilidade de escalonamento dos processos, visando a transição das descobertas da bancada para aplicações em maior escala e, potencialmente, para o mercado. Dessa forma, buscamos reduzir barreiras tecnológicas, aumentar a robustez dos sistemas catalíticos e contribuir para a tradução do conhecimento científico em soluções químicas sustentáveis com impacto industrial.",
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
