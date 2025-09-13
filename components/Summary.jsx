import React from 'react';
import { Box, Heading, SimpleGrid, Stack, Tag, Text, Skeleton, useColorModeValue } from '@chakra-ui/react';

function decodeHtml(str = '') {
  if (!str) return '';
  if (typeof window === 'undefined') return str.replace(/&amp;/g, '&');
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (!div) return str;
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

export function SummarySkeleton() {
  return (
    <Box layerStyle="card">
      <Skeleton height="20px" mb={4} />
      <SimpleGrid columns={2} spacing={4}>
        <Skeleton height="60px" />
        <Skeleton height="60px" />
      </SimpleGrid>
      <Skeleton height="16px" mt={4} mb={2} />
      <Stack>
        <Skeleton height="28px" />
        <Skeleton height="28px" />
      </Stack>
    </Box>
  );
}

export default function Summary({ summary }) {
  if (!summary) return null;
  return (
    <Box borderWidth="1px" borderColor="borderSubtle" rounded="md" overflow="hidden" bg="bgCard" boxShadow="sm">
      <Box bg="redditBlue" color="white" px={4} py={3}>
        <Heading size="sm">Analysis Summary</Heading>
      </Box>
      <Box p={4}>
        <SimpleGrid columns={{ base: 2, md: 2 }} spacing={4}>
          <Stat label="High Engagement Posts" value={summary.highEngagementPosts ?? 0} />
          <Stat label="Trending Posts" value={summary.trendingPosts ?? 0} />
        </SimpleGrid>
        <Box mt={4}>
          <Heading size="sm" mb={2}>Best Growth Opportunities</Heading>
          <Stack spacing={2}>
            {(summary.bestGrowthOpportunities || []).map((item, idx) => (
              <Tag key={idx} size="lg" colorScheme="purple" variant="subtle">{decodeHtml(item)}</Tag>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
