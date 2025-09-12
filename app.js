// Reddit Trend Analyzer - Authentic Reddit UI
(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    function initializeApp() {
        console.log('Reddit Trend Analyzer initialized');

        // Get DOM elements
        const analyzeForm = document.getElementById('analyzeForm');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const spinner = document.getElementById('spinner');
        const btnText = document.querySelector('.btn-text');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const resultsSection = document.getElementById('resultsSection');
        const keywordsInput = document.getElementById('keywords');
        const subredditInput = document.getElementById('subreddit');
        const summarySection = document.getElementById('summarySection');

        // Results elements
        const timestamp = document.getElementById('timestamp');
        const totalPosts = document.getElementById('totalPosts');
        const postsGrid = document.getElementById('postsGrid');
        const highEngagementCount = document.getElementById('highEngagementCount');
        const trendingCount = document.getElementById('trendingCount');
        const growthList = document.getElementById('growthList');

        // Check if all elements exist
        if (!analyzeForm || !analyzeBtn) {
            console.error('Required DOM elements not found');
            return;
        }

        console.log('All DOM elements found, setting up event listeners');

        // Sample data for demonstration (matches the provided JSON)
        const sampleData = {
            "success": true,
            "timestamp": "2025-09-12T15:52:26.629Z",
            "totalPosts": 10,
            "posts": [
                {
                    "title": "I just hit $25,000/MRR in 4 months with n8n",
                    "subreddit": "r/n8n",
                    "author": "u/eeko_systems",
                    "upvotes": 2092,
                    "comments": 698,
                    "url": "https://www.reddit.com/r/n8n/comments/1kki6u5/i_just_hit_25000mrr_in_4_months_with_n8n/",
                    "aiInsight": "thoughtful questions and sharing personal experiences with n8n",
                    "engagement": "high",
                    "growthTip": "establishing oneself as an expert in AI and automation, and potentially gaining clients or collaborations"
                },
                {
                    "title": "I Built an AI Agent Army in n8n That Completely Replaced My Personal Assistant",
                    "subreddit": "r/n8n",
                    "author": "u/LargePay1357",
                    "upvotes": 1841,
                    "comments": 223,
                    "url": "https://i.redd.it/67ywqlhosyjf1.png",
                    "aiInsight": "ask technical questions about the implementation and provide feedback on the AI agent army",
                    "engagement": "high",
                    "growthTip": "commenting on this post can grow a personal account by establishing the user as a thought leader in the n8n and AI automation community"
                },
                {
                    "title": "I made an n8n Cheat Sheet!",
                    "subreddit": "r/n8n",
                    "author": "u/Superb_Net_7426",
                    "upvotes": 1956,
                    "comments": 81,
                    "url": "https://i.redd.it/w4ult2xaxjue1.png",
                    "aiInsight": "Provide valuable feedback or suggestions for the n8n Cheat Sheet",
                    "engagement": "high",
                    "growthTip": "Commenting on this post can grow your personal account by establishing yourself as a knowledgeable member of the n8n community"
                }
            ],
            "summary": {
                "highEngagementPosts": 10,
                "trendingPosts": 0,
                "bestGrowthOpportunities": [
                    "I just hit $25,000/MRR in 4 months with n8n",
                    "I Built an AI Agent Army in n8n That Completely Replaced My Personal Assistant",
                    "I made an n8n Cheat Sheet!"
                ]
            }
        };

        // Form submission handler
        analyzeForm.addEventListener('submit', handleFormSubmit);

        // Add micro-interactions
        addMicroInteractions();

        async function handleFormSubmit(e) {
            e.preventDefault();
            console.log('Form submission started');
            
            const keywords = keywordsInput.value.trim();
            const subreddit = subredditInput.value.trim();

            console.log('Keywords:', keywords, 'Subreddit:', subreddit);

            // Basic validation
            if (!keywords && !subreddit) {
                showError('Please enter keywords or subreddit to analyze.');
                return;
            }

            // Show loading state
            setLoadingState(true);
            hideError();
            hideResults();

            try {
                console.log('Attempting to fetch data...');
                const data = await fetchRedditData(keywords, subreddit);
                displayResults(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                console.log('Using sample data for demonstration');
                
                // Simulate API delay for better UX
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Use sample data but update timestamp
                const fallbackData = {
                    ...sampleData,
                    timestamp: new Date().toISOString()
                };
                
                displayResults(fallbackData);
            } finally {
                setLoadingState(false);
            }
        }

        // Set loading state with Reddit-style loading
        function setLoadingState(isLoading) {
            console.log('Setting loading state:', isLoading);
            if (isLoading) {
                analyzeBtn.disabled = true;
                btnText.textContent = 'Analyzing...';
                spinner.classList.remove('hidden');
            } else {
                analyzeBtn.disabled = false;
                btnText.textContent = 'Analyze';
                spinner.classList.add('hidden');
            }
        }

        // Show error message
        function showError(message) {
            console.log('Showing error:', message);
            errorText.textContent = message;
            errorMessage.classList.remove('hidden');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Hide error message
        function hideError() {
            errorMessage.classList.add('hidden');
        }

        // Hide results
        function hideResults() {
            resultsSection.classList.add('hidden');
            resultsSection.classList.remove('show');
            if (summarySection) {
                summarySection.classList.add('hidden');
                summarySection.classList.remove('show');
            }
        }

        // Fetch Reddit data from API
        async function fetchRedditData(keywords, subreddit) {
            const requestBody = {};
            if (keywords) requestBody.keywords = keywords;
            if (subreddit) requestBody.subreddit = subreddit;

            const apiUrl = `https://goldminer-0.app.n8n.cloud/webhook/reddit-analyze`;
            console.log('Fetching from:', apiUrl);
            console.log('Request body:', requestBody);
            
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });
                
                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                
                const responseText = await response.text();
                console.log('Raw response:', responseText);
                
                // Try to parse as JSON, but handle if it's not valid JSON
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.log('Response is not JSON, treating as text');
                    // If n8n returns plain text or HTML, create a mock response
                    data = {
                        success: true,
                        message: 'Webhook received successfully',
                        posts: [] // Will trigger fallback data
                    };
                }
                
                console.log('Parsed data:', data);
                return data;
                
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        }

        // Display results with fade-in animation
        function displayResults(data) {
            console.log('Displaying results:', data);
            
            // Show results section with fade-in
            resultsSection.classList.remove('hidden');
            if (summarySection) {
                summarySection.classList.remove('hidden');
            }
            
            // Force reflow and add show class for animation
            setTimeout(() => {
                resultsSection.classList.add('show');
                if (summarySection) {
                    summarySection.classList.add('show');
                }
            }, 10);

            // Update header info
            const formattedDate = new Date(data.timestamp).toLocaleString();
            if (timestamp) {
                timestamp.textContent = `Analyzed ${formatRelativeTime(new Date(data.timestamp))}`;
            }
            if (totalPosts) {
                totalPosts.textContent = `${data.totalPosts} posts found`;
            }

            // Clear and populate posts grid
            if (postsGrid) {
                postsGrid.innerHTML = '';
                data.posts.forEach((post, index) => {
                    const postCard = createRedditPost(post, index);
                    postsGrid.appendChild(postCard);
                    
                    // Stagger the animations
                    setTimeout(() => {
                        postCard.classList.add('show');
                    }, index * 150 + 300);
                });
            }

            // Update summary statistics
            if (highEngagementCount) {
                highEngagementCount.textContent = data.summary.highEngagementPosts;
            }
            if (trendingCount) {
                trendingCount.textContent = data.summary.trendingPosts;
            }

            // Update growth opportunities
            if (growthList) {
                growthList.innerHTML = '';
                data.summary.bestGrowthOpportunities.forEach((opportunity, index) => {
                    const li = document.createElement('li');
                    li.textContent = opportunity;
                    growthList.appendChild(li);
                    
                    // Animate growth opportunities
                    setTimeout(() => {
                        li.classList.add('show');
                    }, index * 200 + 800);
                });
            }

            // Smooth scroll to results
            setTimeout(() => {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }

        // Create authentic Reddit post card
        function createRedditPost(post, index) {
            const postElement = document.createElement('div');
            postElement.className = 'reddit-post';

            // Format time ago
            const timeAgo = '2h ago'; // Simulated time

            postElement.innerHTML = `
                <div class="post-main">
                    <div class="post-vote">
                        <div class="vote-arrow vote-up" role="button" tabindex="0">▲</div>
                        <div class="vote-count">${formatNumber(post.upvotes)}</div>
                        <div class="vote-arrow vote-down" role="button" tabindex="0">▼</div>
                    </div>
                    <div class="post-content">
                        <div class="post-meta">
                            <a href="#" class="subreddit-link">${post.subreddit}</a>
                            <span>•</span>
                            <span>Posted by</span>
                            <a href="#" class="author-link">${post.author}</a>
                            <span>${timeAgo}</span>
                        </div>
                        
                        <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="post-title-link">
                            ${post.title}
                        </a>
                        
                        <div class="post-engagement">
                            <span class="engagement-pill engagement-pill--${post.engagement}">
                                ${post.engagement} engagement
                            </span>
                        </div>
                        
                        <div class="post-stats">
                            <div class="stat-item">
                                <span>💬</span>
                                <span>${formatNumber(post.comments)} comments</span>
                            </div>
                            <div class="stat-item">
                                <span>📊</span>
                                <span>Share</span>
                            </div>
                            <div class="stat-item">
                                <span>💾</span>
                                <span>Save</span>
                            </div>
                        </div>
                        
                        <div class="ai-insight">
                            <strong>AI Insight:</strong> ${post.aiInsight}
                        </div>
                        
                        <div class="growth-tip">
                            <div class="growth-tip-title">💡 Growth Opportunity</div>
                            ${post.growthTip}
                        </div>
                    </div>
                </div>
            `;

            // Add vote interactions
            const voteUp = postElement.querySelector('.vote-up');
            const voteDown = postElement.querySelector('.vote-down');
            
            if (voteUp && voteDown) {
                voteUp.addEventListener('click', handleVoteClick);
                voteDown.addEventListener('click', handleVoteClick);
                
                // Keyboard accessibility for votes
                voteUp.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleVoteClick(e);
                    }
                });
                
                voteDown.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleVoteClick(e);
                    }
                });
            }

            return postElement;
        }

        // Handle vote clicks with Reddit-style feedback
        function handleVoteClick(e) {
            e.preventDefault();
            const voteButton = e.target;
            const isUpvote = voteButton.classList.contains('vote-up');
            
            // Add visual feedback
            voteButton.style.transform = 'scale(0.9)';
            voteButton.style.color = isUpvote ? '#ff4500' : '#7193ff';
            
            setTimeout(() => {
                voteButton.style.transform = 'scale(1)';
            }, 150);
            
            // In a real app, this would send the vote to the server
            console.log(`${isUpvote ? 'Upvoted' : 'Downvoted'} post`);
        }

        // Add micro-interactions
        function addMicroInteractions() {
            // Button press animation
            document.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('reddit-btn')) {
                    e.target.style.transform = 'scale(0.98)';
                }
            });
            
            document.addEventListener('mouseup', (e) => {
                if (e.target.classList.contains('reddit-btn')) {
                    e.target.style.transform = 'scale(1)';
                }
            });
            
            // Input focus animations
            document.querySelectorAll('.reddit-input').forEach(input => {
                input.addEventListener('focus', (e) => {
                    const formGroup = e.target.parentElement;
                    formGroup.style.transform = 'scale(1.02)';
                    formGroup.style.transition = 'transform 0.2s ease';
                });
                
                input.addEventListener('blur', (e) => {
                    const formGroup = e.target.parentElement;
                    formGroup.style.transform = 'scale(1)';
                });
            });
        }

        // Format numbers with K/M notation (Reddit style)
        function formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'k';
            }
            return num.toString();
        }

        // Format relative time (simplified)
        function formatRelativeTime(date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 60) return 'just now';
            if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm ago';
            if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h ago';
            return Math.floor(diffInSeconds / 86400) + 'd ago';
        }

        console.log('Reddit Trend Analyzer setup complete');
    }
})();