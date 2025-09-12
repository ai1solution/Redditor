import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Link as ChakraLink,
  Stack,
  Tag,
  Text,
  Textarea,
  useColorMode,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  SimpleGrid,
  Spinner,
  Badge,
  Skeleton,
  SkeletonText,
  useToast,
  Kbd,
  Tooltip,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;

function decodeHtml(str = '') {
  if (!str) return '';
  if (typeof window === 'undefined') return str.replace(/&amp;/g, '&');
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || str;
}

function Stat({ label, value }) {
  const bg = useColorModeValue('gray.50', 'whiteAlpha.100');
  return (
    <Box p={4} rounded="md" bg={bg}>
      <Text fontSize="sm" color="gray.500">{label}</Text>
      <Heading size="md">{value}</Heading>
    </Box>
  );
}

function Summary({ summary }) {
  if (!summary) return null;
  return (
    <Stack spacing={4}>
      <Heading size="md">Analysis Summary</Heading>
      <SimpleGrid columns={{ base: 2, md: 2 }} spacing={4}>
        <Stat label="High Engagement Posts" value={summary.highEngagementPosts ?? 0} />
        <Stat label="Trending Posts" value={summary.trendingPosts ?? 0} />
      </SimpleGrid>
      <Box>
        <Heading size="sm" mb={2}>Best Growth Opportunities</Heading>
        <Stack spacing={2}>
          {(summary.bestGrowthOpportunities || []).map((item, idx) => (
            <Tag key={idx} size="lg" colorScheme="purple" variant="subtle">{decodeHtml(item)}</Tag>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

const MotionBox = motion(Box);

function PostCard({ post, onOpenImage }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isImage = post?.url?.match(/\.(png|jpg|jpeg|gif|webp)$/i);

  return (
    <MotionBox
      borderWidth="1px"
      borderColor={borderColor}
      rounded="md"
      p={4}
      bg={cardBg}
      shadow="sm"
      whileHover={{ y: -4, boxShadow: 'var(--chakra-shadows-md)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <HStack spacing={2} color="gray.500" fontSize="sm" mb={2}>
        <ChakraLink href={`https://www.reddit.com/${post.subreddit?.replace(/^\//, '')}`} isExternal fontWeight="semibold">
          {post.subreddit}
        </ChakraLink>
        <Text>•</Text>
        <Text>Posted by</Text>
        <ChakraLink href={`https://www.reddit.com/${post.author}`} isExternal>
          {post.author}
        </ChakraLink>
      </HStack>

      <Heading size="sm" mb={2}>
        <ChakraLink href={post.url} isExternal>{decodeHtml(post.title)}</ChakraLink>
      </Heading>

      {isImage ? (
        <Box overflow="hidden" rounded="md" mb={3} cursor="zoom-in" onClick={() => onOpenImage?.(post)}>
          <Image src={post.url} alt={post.title} objectFit="cover" w="100%" maxH="300px"/>
        </Box>
      ) : null}

      <HStack spacing={4} color="gray.600" fontSize="sm" mb={3}>
        <Text>⬆️ {Intl.NumberFormat('en', { notation: 'compact' }).format(post.upvotes)}</Text>
        <Text>💬 {Intl.NumberFormat('en', { notation: 'compact' }).format(post.comments)} comments</Text>
        <Tag size="sm" colorScheme={post.engagement === 'high' ? 'green' : post.engagement === 'medium' ? 'orange' : 'gray'}>
          {post.engagement} engagement
        </Tag>
        <Badge colorScheme="blue" variant="subtle">AI</Badge>
      </HStack>

      {post.aiInsight ? (
        <Box bg={useColorModeValue('orange.50', 'orange.900')} p={3} rounded="md" mb={2}>
          <Text fontWeight="semibold">AI Insight:</Text>
          <Text>{post.aiInsight}</Text>
        </Box>
      ) : null}

      {post.growthTip ? (
        <Box bg={useColorModeValue('purple.50', 'purple.900')} p={3} rounded="md">
          <Text fontWeight="semibold">💡 Growth Opportunity</Text>
          <Text>{post.growthTip}</Text>
        </Box>
      ) : null}
    </MotionBox>
  );
}

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [keywords, setKeywords] = useState('');
  const [subreddit, setSubreddit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all'); // all | high
  const [sort, setSort] = useState('top'); // top | comments | recent
  const toast = useToast();
  const [imagePost, setImagePost] = useState(null);

  const pageBg = useColorModeValue('gray.50', 'gray.900');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (!keywords && !subreddit) {
      setError('Please enter keywords or subreddit to analyze.');
      toast({ title: 'Missing input', description: 'Enter keywords or a subreddit.', status: 'warning' });
      return;
    }

    setLoading(true);
    setData(null);
    try {
      const body = {};
      if (keywords) body.keywords = keywords;
      if (subreddit) body.subreddit = subreddit;

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });

      const rawText = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        parsed = { success: true, posts: [], timestamp: new Date().toISOString(), totalPosts: 0, summary: { highEngagementPosts: 0, trendingPosts: 0, bestGrowthOpportunities: [] } };
      }

      const payload = Array.isArray(parsed) ? parsed[0] : parsed;
      if (!res.ok || !payload?.success) {
        throw new Error(`Request failed: ${res.status}`);
      }
      setData(payload);
      toast({ title: 'Analysis complete', description: `Found ${payload.totalPosts} posts`, status: 'success' });
    } catch (err) {
      setError(err.message || 'Failed to analyze.');
      toast({ title: 'Error', description: err.message || 'Failed to analyze.', status: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const filteredSortedPosts = (() => {
    if (!data?.posts) return [];
    let posts = [...data.posts];
    if (filter === 'high') posts = posts.filter((p) => (p.engagement || '').toLowerCase() === 'high');
    if (sort === 'top') posts.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    if (sort === 'comments') posts.sort((a, b) => (b.comments || 0) - (a.comments || 0));
    if (sort === 'recent') posts = posts; // Backend lacks per-post time; keep as-is
    return posts;
  })();

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box borderBottomWidth="1px" bg={useColorModeValue('white', 'gray.800')}> 
        <Container maxW="6xl" py={4}>
          <Flex align="center" justify="space-between">
            <Heading size="md">Reddit Trend Analyzer</Heading>
            <Button onClick={toggleColorMode} leftIcon={<Icon as={colorMode === 'light' ? MoonIcon : SunIcon} /> }>
              {colorMode === 'light' ? 'Dark' : 'Light'}
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="6xl" py={8}>
        <Stack spacing={6}>
          <Box as="form" onSubmit={onSubmit} bg={useColorModeValue('white', 'gray.800')} p={6} rounded="md" shadow="sm">
            <Heading size="md" mb={1}>Create Analysis</Heading>
            <Text color="gray.500" mb={4}>Analyze Reddit trends and find growth opportunities</Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={1} fontWeight="medium">Keywords</Text>
                <Input placeholder="Enter keywords (comma separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
              </Box>
              <Box>
                <Text mb={1} fontWeight="medium">Subreddit (optional)</Text>
                <Input placeholder="Enter subreddit (e.g., n8n)" value={subreddit} onChange={(e) => setSubreddit(e.target.value)} />
              </Box>
            </SimpleGrid>

            <Flex mt={4} gap={3} align="center" wrap="wrap">
              <Button type="submit" colorScheme="orange" isLoading={loading} loadingText="Analyzing...">Analyze</Button>
              <HStack>
                <Tooltip label="Filter posts by engagement">
                  <Select size="sm" value={filter} onChange={(e) => setFilter(e.target.value)} w="auto">
                    <option value="all">All</option>
                    <option value="high">High engagement</option>
                  </Select>
                </Tooltip>
                <Tooltip label="Sort posts">
                  <Select size="sm" value={sort} onChange={(e) => setSort(e.target.value)} w="auto">
                    <option value="top">Top upvotes</option>
                    <option value="comments">Most comments</option>
                    <option value="recent">Recent</option>
                  </Select>
                </Tooltip>
              </HStack>
              <Text ml="auto" color="gray.500" fontSize="sm" display={{ base: 'none', md: 'block' }}>
                Press <Kbd>Enter</Kbd> to analyze
              </Text>
            </Flex>
          </Box>

          {error ? (
            <Alert status="error" rounded="md">
              <AlertIcon />
              <AlertTitle>Error:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} p={4} rounded="md" bg={useColorModeValue('white', 'gray.800')} borderWidth="1px">
                  <Skeleton height="16px" mb={2} />
                  <Skeleton height="24px" mb={3} />
                  <Skeleton height="160px" mb={3} />
                  <SkeletonText noOfLines={3} spacing="2" />
                </Box>
              ))}
            </SimpleGrid>
          ) : null}

          {data ? (
            <Stack spacing={6}>
              <Flex align="center" justify="space-between">
                <Heading size="md">Analysis Results</Heading>
                <HStack color="gray.500" fontSize="sm">
                  <Text>{new Date(data.timestamp).toLocaleString()}</Text>
                  <Text>•</Text>
                  <Text>{data.totalPosts} {data.totalPosts === 1 ? 'post' : 'posts'}</Text>
                </HStack>
              </Flex>

              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {filteredSortedPosts.map((p, idx) => (
                      <PostCard key={idx} post={p} onOpenImage={setImagePost} />
                    ))}
                  </SimpleGrid>
                </GridItem>
                <GridItem colSpan={1}>
                  <Summary summary={data.summary} />
                </GridItem>
              </SimpleGrid>
            </Stack>
          ) : null}
        </Stack>
      </Container>

      <Modal isOpen={!!imagePost} onClose={() => setImagePost(null)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{imagePost ? decodeHtml(imagePost.title) : ''}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {imagePost ? (
              <Image src={imagePost.url} alt={imagePost.title} w="100%" />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
