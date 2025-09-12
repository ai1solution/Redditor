import React from 'react';
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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

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
