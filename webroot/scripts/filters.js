"use strict";
var blackriverinc = blackriverinc || {}
blackriverinc.filters = {

    debug: true,

    glowOn: function ($target) {
        $target.not('.ghost').addClass('glow');
        $('.selected-skills .prompt').addClass('highlight');
    },

    glowOff: function ($target) {
        $target.removeClass('glow');
        $('.selected-skills .prompt').removeClass('highlight');
    },

    documentReady: function (xdivId) {

        var showEaseMs = 100;

        $('.filter > input').hide();

        if (xdivId === null) {
            xdivId = 'xenvironment';
        }

        var skillOpValue = $('#skill-op').val();

        // Extract list of skills; display the list.
        function generateSkillsDisplay(xskillsClass) {
            var xskills = $('#experience [xskills]');
            xskills.each(function (idx) {
                var skills = xskills[idx].getAttribute(xskillsClass).split(' ');

                var displaySkills = $('.' + xskillsClass, xskills[idx]);
                $(displaySkills).append('<span> (' + skills.join(', ') + ')</span>');
                blackriverinc.filters.debug && console.log(skills);
            });
        }
        
        function extractSkillValue(filterCtrl) {
            // *NOTE* Not using '\s' as delimitter, because '&nbsp;'
            //        (used to stitch together compound terms)
            //        qualifies as "white-space".
            var tokens = $(filterCtrl).text().split(/[\n\t,\x20]+/);
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].length > 0) {
                    return tokens[i];
                }
            }
            return "";
        }

        function hideJobDetail($job) {
            $job.addClass('masked');
        }

        //--------------------------------------------------------
        // Select jobs that required *any* of the selected skills.
        function filterAny() {
            var $skills = $('.selected-skills .filter');

            // If no skills selected, do not filter out jobs.
            if ($skills.length == 0) {
                if (blackriverinc.filters.debug) { console.log('*none*'); }
                $('div[' + xdivId + ']').removeClass('masked');
                return;
            }

            // Hide all, then show jobs that match any selected skill.
            $('div[' + xdivId + ']').addClass('masked');
            $.each($skills, function (index) {
                var skillValue = extractSkillValue(this);
                var $jobs = $('div[' + xdivId + ' *= "' + skillValue + '"]');
                $jobs.removeClass('masked')
                if (blackriverinc.filters.debug) {
                    $.each($jobs, function () {
                        console.log($('h2,h3', $(this)).text());
                    });
                }
                return true;
            });
        }

        //--------------------------------------------------------
        // Select jobs that required *all* of the selected skills
        function filterAll() {
            var $skills = $('.selected-skills .filter');

            // If no skills selected, then do not filter out jobs.
            if ($skills.length == 0) {
                if (blackriverinc.filters.debug) { console.log('*none*'); }
                $('div[' + xdivId + ']').show();
                return;
            }
            // Show all, then hide jobs that do not match all of 
            // the selected skills.
            $('div[' + xdivId + ']').removeClass('masked')

            // Iterate over all of the jobs
            $.each($('div[' + xdivId + ']'), function () {
                $job = $(this);
                var hasSkill = true;

                // For each job, iterate over the selected skill set.
                $.each($skills, function () {
                    var skillValue = extractSkillValue(this);
                    hasSkill = $job.attr(xdivId).indexOf(skillValue) > (-1);
                    // Returning false will stop the iteration.
                    return hasSkill;
                });

                if (!hasSkill) {
                    $job.addClass('masked');
                } else {
                    if (blackriverinc.filters.debug) { console.log($('h2,h3', $job).text()); }
                }
                return true;
            });
        }

        function filterSkills() {
            skillOpValue = $('#skill-op').val();
            if (blackriverinc.filters.debug) { console.log('Skill Operator = ' + skillOpValue); }

            // If no skill operator selected, hide all filters and show all jobs.
            if (skillOpValue == '') {
                $('div[' + xdivId + ']').show();
            }

            if (skillOpValue == '|') {
                filterAny();
            }
            if (skillOpValue == '&') {
                filterAll();
            }
        }

        $('#skill-op').click(filterSkills);

        $('.filter:not(.ghost)').draggable({
            revert: 'invalid',
            helper: 'clone'
        });

        function setClearFilterEvent(target, eventName) {
            $(target).on(eventName, function (src) {
                var skillKey = target.text().trim();
                if (blackriverinc.filters.debug) { console.log('Removed : ' + skillKey); }
                $(src.currentTarget).remove();
                var $ghost = $('.filter.ghost:contains(' + skillKey + ')');
                $ghost.draggable({ disabled: false });
                $ghost.removeClass('ghost');
                if ($('.selected-skills .filter').length == 0) {
                    $('.selected-skills .prompt').show();
                }
                setTimeout(filterSkills, 0);
            });
        }

        var mouseTimer = null;
        var touchTimer = null;

        $('#skills .filter').mouseover(function (evt) {
            blackriverinc.filters.glowOn($(evt.target));
            mouseTimer = setTimeout(function () {
                $(evt.target).addClass('tooltip');
            }, 2000);
        });

        $('#skills .filter').mouseout(function (evt) {
            blackriverinc.filters.glowOff($(evt.target));
            if (mouseTimer != null) {
                $(evt.target).removeClass('tooltip');
                clearTimeout(mouseTimer);
            }
        });

        $('.selected-skills').mouseover(function (evt) {
            // Don't bother with prompt'n'glow if they already figured it out.
            if ($('.selected-skills .filter').length > 0) {
                return true;
            }
            blackriverinc.filters.glowOn($('#skills .filter'));
        });

        $('.selected-skills').mouseout(function () {
            blackriverinc.filters.glowOff($('#skills .filter'));          
        });

        $('.row-filters .ui-draggable.filter').mousedown(function (evt) {
            touchTimer = setTimeout(function () {
              //  dropsies.drop(evt, evt.target);
            });
        });

        $('.row-filters .ui-draggable.filter').mouseup(function (evt) {
            touchTimer = setTimeout(function () {
                if (touchTimer != null) {
                    clearTimeout(touchTimer);
                }
            });
        });

        //
        var selectSkill = function (target, droppable) {
            blackriverinc.filters.debug && console.log('drop : ' + target.textContent.trim());

            var skillKey = droppable.draggable[0].textContent.trim();

            // Accept a Skill if it is not already attached to the 
            // drop-site.
            if ($(':contains(' + skillKey + ')', target).length == 0) {
                if (blackriverinc.filters.debug) { console.log('Added : ' + skillKey); }

                $('.selected-skills .prompt').hide();

                var $clonedTarget = $(droppable.draggable).clone();
                $clonedTarget.removeClass('tooltip');
                $clonedTarget.append("<img src='images/chi.black.png' />");
                $(target).append($clonedTarget);

                droppable.draggable.draggable({ disabled: true });
                $(droppable.draggable).addClass('ghost');

                setClearFilterEvent($clonedTarget, 'click');
                setClearFilterEvent($clonedTarget, 'touchend');

                $clonedTarget.mouseover(function (evt) {
                    mouseTimer = setTimeout(function () {
                        $(evt.target).addClass('tooltip');
                        $(evt.target).addClass('tooltip-bottom');
                    }, 2000);
                    evt.stopPropagation();

                });

                $clonedTarget.mouseout(function (evt) {
                    if (mouseTimer != null) {
                        $(evt.target).removeClass('tooltip');
                        $(evt.target).removeClass('tooltip-bottom');
                        clearTimeout(mouseTimer);
                    }
                });

                setTimeout(filterSkills, 0);

                return true;
            }
        }
        var dropsies = $('.selected-skills').droppable({
            tolerence: "touch",
            drop: function (evt, droppable) { selectSkill(evt.target, droppable); },
            accept: '.filter'
        });

        //-------------------------------------------------------------
        // x-ref : Click to see more...
        $('.x-ref:not(.open)').mouseover(function (evt) {
            blackriverinc.filters.glowOn($(evt.target));
        });

        $('.x-ref').mouseout(function (evt) {
            blackriverinc.filters.glowOff($(evt.target));
        });

        $('.x-ref').click(function (evt) {
            // Clear the 'tooltip'
            var $source = $(evt.currentTarget);
            var sourceAttr = $source.attr('x-ref');
            if (sourceAttr === undefined) {
                return;
        }
            // Hide the previous 'x-more' box.
            var $xmore = $source.siblings('.x-more:visible');
            if ($xmore.length > 0) {
                $xmore.hide('slideUp');
                var lastTarget = $xmore.attr('x-ref-target');
                $('[x-ref="' + lastTarget + '"]').removeClass('open');
                if (lastTarget == sourceAttr) {
                    return;
                }
            }

            // Show the box.
            if (sourceAttr != null) {
                var $xmore = $('[x-ref-target="' + sourceAttr + '"].x-more');
                $source.addClass('open')
                $xmore.show('slideDown');
            }           
        });

        $('.brs-menu').click(function (evt) {
            // If this is a non-submenu link; close the parent menu.
            if ($(evt.target).attr('x-ref') === undefined) {
                $(evt.target).parents('.x-more').siblings('.x-ref').trigger('click');
            }
        });

        $('#experience').on('click', '.x-more', function (evt) {
            var $xmore = $(evt.target).closest('.x-more');
            $xmore.hide('slide');
            var lastTarget = $xmore.attr('x-ref-target');
            $('[x-ref="' + lastTarget + '"]').removeClass('open');
        });

        // Invoke skill filters when page loaded or reloaded.
        $('#skill-op').click();

        generateSkillsDisplay(xdivId);
    }
}

