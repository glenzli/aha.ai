import { IContextSeed } from "../../../crawler";

export const DUMMY_SEEDS: IContextSeed[] = [
    {
        title: 'FineInstructions: Scaling Synthetic Instructions to Pre-Training Scale',
        authors: ['Ajay Patel', 'Colin Raffel', 'Chris Callison-Burch'],
        organization: 'FineInstructions',
        publishedAt: '2026-01-29T18:58:47.000Z',
        summary: 'Due to limited supervised training data, large language models (LLMs) are typically pre-trained via a self-supervised \"predict the next word\" objective on a vast amount of unstructured text data. To make the resulting model useful to users, it is further trained on a far smaller amount of \"instruction-tuning\" data comprised of supervised training examples of instructions and responses. To overcome the limited amount of supervised data, we propose a procedure that can transform the knowledge in internet-scale pre-training documents into billions of synthetic instruction and answer training pairs. The resulting dataset, called FineInstructions, uses ~18M instruction templates created from real user-written queries and prompts. These instruction templates are matched to and instantiated with human-written source documents from unstructured pre-training corpora. With \"supervised\" synthetic training data generated at this scale, an LLM can be pre-trained from scratch solely with the instruction-tuning objective, which is far more in-distribution with the expected downstream usage of LLMs (responding to user prompts). We conduct controlled token-for-token training experiments and find pre-training on FineInstructions outperforms standard pre-training and other proposed synthetic pre-training techniques on standard benchmarks measuring free-form response quality. Our resources can be found at https://huggingface.co/fineinstructions .',
        url: '',
        likes: 1,
    },
    {
        title: 'Scalable Power Sampling: Unlocking Efficient, Training-Free Reasoning for LLMs via Distribution Sharpening',
        authors: ['Xiaotong Ji', 'Rasul Tutunov', 'Matthieu Zimmer', 'Haitham Bou Ammar'],
        organization: 'Peking University',
        publishedAt: '2026-01-29T07:01:53.000Z',
        summary: 'Reinforcement learning (RL) post-training is a dominant approach for improving the reasoning performance of large language models (LLMs), yet growing evidence suggests that its gains arise primarily from distribution sharpening rather than the acquisition of new capabilities. Recent work has shown that sampling from the power distribution of LLMs using Markov chain Monte Carlo (MCMC) can recover performance comparable to RL post-training without relying on external rewards; however, the high computational cost of MCMC makes such approaches impractical for widespread adoption. In this work, we propose a theoretically grounded alternative that eliminates the need for iterative MCMC. We derive a novel formulation showing that the global power distribution can be approximated by a token-level scaled low-temperature one, where the scaling factor captures future trajectory quality. Leveraging this insight, we introduce a training-free and verifier-free algorithm that sharpens the base model\'s generative distribution autoregressively. Empirically, we evaluate our method on math, QA, and code tasks across four LLMs, and show that our method matches or surpasses one-shot GRPO without relying on any external rewards, while reducing inference latency by over 10x compared to MCMC-based sampling.',
        url: '',
        likes: 52,
        hot: true,
    },
    {
        title: 'ABC is Testing 1',
        authors: ['Demo1 Yang', 'Demo2 Li'],
        publishedAt: '2026-01-29T07:01:53.000Z',
        summary: 'Summary1',
        url: '',
        likes: 6,
    },
    {
        title: 'ABC is Testing 2',
        authors: ['Demo3 Yang', 'Demo4 Li'],
        publishedAt: '2026-01-29T07:01:53.000Z',
        summary: 'Summary2',
        organization: 'TestOrg',
        url: '',
    },

    {
        title: 'ABC is Testing 3',
        authors: ['Demo5 Yang', 'Demo6 Li'],
        publishedAt: '2026-01-29T07:01:53.000Z',
        summary: 'Summary3',
        url: '',
    },
];
