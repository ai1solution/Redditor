import React, { useMemo, useState } from 'react';
import {
  Box,
  HStack,
  Heading,
  Image,
  Link as ChakraLink,
  Tag,
  Text,
  Badge,
  useColorModeValue,
  VStack,
  IconButton,
  Tooltip,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon, CopyIcon } from '@chakra-ui/icons';

function decodeHtml(str = '') {
  if (!str) return '';
  if (typeof window === 'undefined') return str.replace(/&amp;/g, '&');
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (!div) return str;
  div.innerHTML = str;
  return div.textContent || str;
}

const MotionBox = motion(Box);

export default function PostCard({ post, onOpenImage }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isImage = post?.url?.match(/\.(png|jpg|jpeg|gif|webp)$/i);
  const toast = useToast();

  const [vote, setVote] = useState(0); // -1, 0, 1
  const baseUpvotes = post?.upvotes || 0;
  const displayedUpvotes = useMemo(() => baseUpvotes + vote, [baseUpvotes, vote]);

  return (
    <MotionBox
      layerStyle="card"
      whileHover={{ y: -2, boxShadow: 'var(--chakra-shadows-md)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      w="auto"
      overflow="hidden"
    >
      <HStack align="start" spacing={4} w="auto">
        {/* Vote column */}
        <VStack spacing={1} align="center" minW="40px">
          <IconButton
            aria-label="Upvote"
            size="sm"
            icon={<ChevronUpIcon />}
            variant={vote === 1 ? 'solid' : 'ghost'}
            colorScheme={vote === 1 ? 'brand' : 'gray'}
            onClick={() => setVote((v) => (v === 1 ? 0 : 1))}
          />
          <Text fontWeight="semibold">{Intl.NumberFormat('en', { notation: 'compact' }).format(displayedUpvotes)}</Text>
          <IconButton
            aria-label="Downvote"
            size="sm"
            icon={<ChevronDownIcon />}
            variant={vote === -1 ? 'solid' : 'ghost'}
            colorScheme={vote === -1 ? 'gray' : 'gray'}
            onClick={() => setVote((v) => (v === -1 ? 0 : -1))}
          />
        </VStack>

        {/* Content */}
        <Box flex="1" minW={0}>
          <Wrap spacing={2} fontSize="sm" mb={1} color="textMuted">
            <WrapItem>
              <ChakraLink href={`https://www.reddit.com/${post.subreddit?.replace(/^\//, '')}`} isExternal fontWeight="semibold" color="redditBlue">
                {post.subreddit}
              </ChakraLink>
            </WrapItem>
            <WrapItem><Text>•</Text></WrapItem>
            <WrapItem><Text>Posted by</Text></WrapItem>
            <WrapItem>
              <ChakraLink href={`https://www.reddit.com/${post.author}`} isExternal>
                {post.author}
              </ChakraLink>
            </WrapItem>
          </Wrap>

          <Heading size="sm" mb={3} wordBreak="break-word" overflowWrap="anywhere">
            <ChakraLink href={post.url} isExternal sx={{ wordBreak: 'break-word', overflowWrap: 'anywhere', display: 'inline' }}>
              {decodeHtml(post.title)}
            </ChakraLink>
          </Heading>

          {isImage ? (
            <Box overflow="hidden" rounded="md" mb={3} cursor="zoom-in" onClick={() => onOpenImage?.(post)}>
              <Image src={post.url} alt={post.title} objectFit="cover" w="100%" maxH="260px"/>
            </Box>
          ) : null}

          <HStack spacing={4} fontSize="sm" mb={3} color="textMuted">
            <Text wordBreak="break-word">💬 {Intl.NumberFormat('en', { notation: 'compact' }).format(post.comments)} comments</Text>
            <Tag size="sm" colorScheme={post.engagement === 'high' ? 'green' : post.engagement === 'medium' ? 'orange' : 'gray'}>
              {post.engagement} engagement
            </Tag>
            <Badge colorScheme="blue" variant="subtle">AI</Badge>
          </HStack>

          {post.aiInsight ? (
            <Box bg={useColorModeValue('orange.50', 'orange.900')} p={3} rounded="md" mb={3}>
              <Text fontWeight="semibold" mb={1}>AI Insight</Text>
              <Text wordBreak="break-word" overflowWrap="anywhere">{post.aiInsight}</Text>
            </Box>
          ) : null}

          {post.growthTip ? (
            <Box bg={useColorModeValue('purple.50', 'purple.900')} p={3} rounded="md" display="flex" alignItems="start" justifyContent="space-between" gap={3}>
              <Box>
                <Text fontWeight="semibold" mb={1}>💡 Growth Opportunity</Text>
                <Text wordBreak="break-word" overflowWrap="anywhere">{post.growthTip}</Text>
              </Box>
              <Tooltip label="Copy growth tip">
                <IconButton
                  aria-label="Copy growth tip"
                  icon={<CopyIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(post.growthTip || '');
                      toast({ title: 'Copied', description: 'Growth tip copied to clipboard', status: 'success', duration: 1500 });
                    } catch (_) {
                      toast({ title: 'Failed to copy', status: 'error', duration: 1500 });
                    }
                  }}
                />
              </Tooltip>
            </Box>
          ) : null}
        </Box>
      </HStack>
    </MotionBox>
  );
}
